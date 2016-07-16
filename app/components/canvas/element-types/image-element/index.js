import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Motion, spring } from "react-motion";
import { omit, defer } from "lodash";

import {
  SpringSettings,
  BLACKLIST_CURRENT_ELEMENT_DESELECT
} from "../../../../constants";
import { getElementDimensions, getPointsToSnap, snap } from "../../../../utils";
import styles from "./index.css";
import ResizeNode from "../../resize-node";
import Arrange from "../arrange";

export default class ImageElement extends Component {
  static propTypes = {
    elementIndex: PropTypes.number,
    component: PropTypes.shape({
      ComponentClass: React.PropTypes.any.isRequired,
      props: PropTypes.object
    }),
    selected: PropTypes.bool,
    mousePosition: PropTypes.array,
    scale: PropTypes.number,
    showGridLine: PropTypes.func,
    hideGridLine: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isPressed: false,
      mouseStart: [0, 0],
      delta: [0, 0]
    };
  }

  componentDidMount() {
    defer(() => {
      const { width, height } = this.currentElementComponent.getBoundingClientRect();

      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        width,
        height
      });
    });
  }

  shouldComponentUpdate() {
    // This is needed because of the way the component is passed down
    // React isn't re-rendering this when the contextual menu updates the store
    return true;
  }

  handleTouchStartResize = (ev) => {
    ev.preventDefault();
    this.handleMouseDownResize(ev.touches[0]);
  }

  handleMouseDownResize = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    const { currentTarget, pageX, pageY } = ev;

    const isLeftSideDrag =
      currentTarget === this.leftResizeNode ||
      currentTarget === this.topLeftNode ||
      currentTarget === this.bottomLeftNode;
    const isTopDrag =
      currentTarget === this.topLeftNode ||
      currentTarget === this.topRightNode;
    const verticalResize =
      currentTarget === this.topLeftNode ||
      currentTarget === this.bottomLeftNode ||
      currentTarget === this.topRightNode ||
      currentTarget === this.bottomRightNode;

    const { width, height } = this.currentElementComponent.getBoundingClientRect();
    const componentProps = this.props.component.props;
    const componentLeft = componentProps.style && componentProps.style.left;
    const componentTop = componentProps.style && componentProps.style.top;
    const left = componentLeft || 0;
    const top = componentTop || 0;

    this.gridLines = this.context.store.gridLines;

    this.setState({
      isTopDrag,
      isLeftSideDrag,
      verticalResize,
      isResizing: true,
      width,
      height,
      top,
      left,
      resizeLastX: pageX,
      resizeLastY: pageY
    });

    window.addEventListener("mousemove", this.handleMouseMoveResize);
    window.addEventListener("touchmove", this.handleTouchMoveResize);
    window.addEventListener("mouseup", this.handleMouseUpResize);
    window.addEventListener("touchend", this.handleTouchEndResize);
  }

  handleTouchMoveResize = (ev) => {
    ev.preventDefault();
    this.handleMouseMoveResize(ev.touches[0]);
  }

  handleMouseMoveResize = (ev) => {
    ev.preventDefault();
    const { pageX, pageY } = ev;
    const {
      isLeftSideDrag,
      resizeLastX,
      width,
      height,
      resizeLastY,
      isTopDrag,
      verticalResize
    } = this.state;

    let { left, top } = this.state;
    const delta = [];
    let isSnapped;

    const snapCallback = (line, index) => {
      if (line === null) {
        this.props.hideGridLine(true);
        isSnapped = false;
        return;
      }

      let pointToAlignWithLine;

      if (index === 0) {
        pointToAlignWithLine = left;
      }

      if (index === 1) {
        pointToAlignWithLine = Math.ceil(left + width / 2);
      }

      if (index === 2) {
        pointToAlignWithLine = Math.ceil(left + width);
      }

      const distance = Math.abs(pointToAlignWithLine - line);

      if (distance <= 3) {
        isSnapped = true;
        this.props.showGridLine(line, true);
      }
    };

    snap(
      this.gridLines.vertical,
      getPointsToSnap(
        left,
        width,
        (Math.max(pageX, resizeLastX) - Math.min(pageX, resizeLastX)) / 2
      ),
      snapCallback
    );

    if (verticalResize) {
      snap(
        this.gridLines.horizontal,
        getPointsToSnap(
          top,
          height,
          (Math.max(pageY, resizeLastY) - Math.min(pageY, resizeLastY)) / 2
        ),
        snapCallback
      );
    }

    if (isSnapped) {
      return;
    }

    if (isLeftSideDrag) {
      delta[0] = resizeLastX - pageX;
      left -= delta[0];
    } else {
      delta[0] = pageX - resizeLastX;
    }

    if (isTopDrag) {
      delta[1] = resizeLastY - pageY;
      top -= delta[1];
    } else {
      delta[1] = pageY - resizeLastY;
    }

    const newWidth = delta[0] + width;
    const newHeight = delta[1] + height;
    let nextState = {};

    if (newWidth >= 0) {
      nextState = { left, width: (delta[0] + width), resizeLastX: pageX };
    }

    if (newHeight >= 0) {
      nextState = { ...nextState, top, height: (delta[0] + height), resizeLastY: pageY };
    }

    if (Object.keys(nextState).length) {
      this.setState(nextState);
    }
  }

  handleTouchEndResize = (ev) => {
    ev.preventDefault();
    this.handleMouseUpResize(ev.touches[0]);
  }

  handleMouseUpResize = (ev) => {
    ev.preventDefault();
    window.removeEventListener("mousemove", this.handleMouseMoveResize);
    window.removeEventListener("mouseup", this.handleMouseUpResize);
    window.removeEventListener("touchmove", this.handleTouchMoveResize);
    window.removeEventListener("touchend", this.handleTouchEndResize);

    this.props.hideGridLine(true);
    this.setState({
      isResizing: false
    });

    const { width, left, top, height } = this.state;
    const propStyles = { ...this.props.component.props.style, width, left, top, height };

    this.context.store.updateElementProps({ style: propStyles });
  }

  handleTouchStart = (ev) => {
    ev.preventDefault();
    this.handleMouseDown(ev.touches[0]);
  }

  handleTouchMove = (ev) => {
    ev.preventDefault();
    this.handleMouseMove(ev.touches[0]);
  }

  handleMouseMove = ({ pageX, pageY, offsetX, offsetY, target: { id } }) => {
    const {
      mouseStart: [x, y],
      mouseOffset: [mouseOffsetX, mouseOffsetY],
      originalPosition: [originalX, originalY],
      width,
      height
    } = this.state;

    const newDelta = [pageX - x, pageY - y];

    // Note: This doesn't handle the case of the mouse being off the slide and part of the element
    // still on the slide. AKA no gridlines or snapping will occur when mouse is outside of the
    // slide.
    if (id === "slide") {
      const createSnapCallback = (isVertical, length, originalPoint) => (line, index) => {
        if (line === null) {
          this.props.hideGridLine(isVertical);

          return;
        }

        this.props.showGridLine(line, /* isVertical */ isVertical);

        // Index 0 = starting edge, 1 = middle, 2 = ending edge
        const offset = originalPoint + (length / 2 * index);

        // Set either x or y
        newDelta[isVertical ? 0 : 1] = line - offset;
      };

      snap(
        this.gridLines.horizontal,
        getPointsToSnap(offsetY, height, mouseOffsetY),
        createSnapCallback(false, height, originalY)
      );

      snap(
        this.gridLines.vertical,
        getPointsToSnap(offsetX, width, mouseOffsetX),
        createSnapCallback(true, width, originalX)
      );
    } else {
      this.props.hideGridLine(true);
      this.props.hideGridLine(false);
    }

    this.setState({
      delta: newDelta
    });
  }

  handleMouseDown = (ev) => {
    ev.preventDefault();

    if (this.clickStart) {
      this.clicking = false;
      this.handleDoubleClick(ev);

      return;
    }

    this.clickStart = new Date().getTime();
    this.context.store.setCurrentElementIndex(this.props.elementIndex);

    const { pageX, pageY, target } = ev;
    const boundingBox = target.getBoundingClientRect();
    const mouseOffset = [Math.floor(boundingBox.left - pageX), Math.floor(boundingBox.top - pageY)];
    const originalPosition = [
      this.props.component.props.style.left,
      this.props.component.props.style.top
    ];

    let { width, height } = getElementDimensions(this.props.component);

    if (height === undefined) {
      height = this.currentElementComponent.getBoundingClientRect().height;
    }

    if (width === undefined) {
      width = this.currentElementComponent.getBoundingClientRect().width;
    }

    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("touchend", this.handleMouseUp);

    // Do this preemptively so that dragging doesn't take the performance hit
    this.gridLines = this.context.store.gridLines;

    // Only do drag if we hold the mouse down for a bit
    this.mouseClickTimeout = setTimeout(() => {
      this.clickStart = null;
      this.mouseClickTimeout = null;

      this.context.store.updateElementDraggingState(true, true);

      // Make the cursor dragging everywhere
      document.body.style.cursor = "-webkit-grabbing";

      // TODO: handle elements that aren't absolutely positioned?
      this.setState({
        delta: [0, 0],
        mouseStart: [pageX, pageY],
        isPressed: true,
        mouseOffset,
        originalPosition,
        width,
        height
      });

      window.addEventListener("touchmove", this.handleTouchMove);
      window.addEventListener("mousemove", this.handleMouseMove);
    }, 150);
  }

  handleMouseUp = () => {
    if (this.mouseClickTimeout || this.mouseClickTimeout === 0) {
      clearTimeout(this.mouseClickTimeout);
      window.removeEventListener("mouseup", this.handleMouseUp);
      window.removeEventListener("touchend", this.handleMouseUp);

      this.mouseClickTimeout = null;

      // this.props.onDropElement(this.props.elementType);
      const timeSinceMouseDown = new Date().getTime() - this.clickStart;

      // Give the user the remainder of the 250ms to do a double click
      setTimeout(() => {
        this.clickStart = null;
      }, 250 - timeSinceMouseDown);

      return;
    }

    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    // Reset the cursor dragging to auto
    document.body.style.cursor = "auto";

    this.props.hideGridLine(false);
    this.props.hideGridLine(true);

    this.context.store.updateElementDraggingState(false);
    this.context.store.updateElementProps({
      style: {
        left: this.state.delta[0] + this.props.component.props.style.left,
        top: this.state.delta[1] + this.props.component.props.style.top
      }
    });

    this.setState({
      delta: [0, 0],
      mouseStart: [0, 0],
      isPressed: false
    });
  }

  handleDoubleClick = () => {
    // double click
  }

  render() {
    const {
      elementIndex,
      selected,
      component: { ComponentClass, props },
      mousePosition,
      scale
    } = this.props;

    const {
      width,
      height,
      isResizing,
      isPressed,
      delta: [x, y],
      left,
      top
    } = this.state;

    const currentlySelected = selected || elementIndex === this.context.store.currentElementIndex;
    const extraClasses = currentlySelected ? ` ${styles.selected}` : "";

    const wrapperStyle = {};
    const motionStyles = {};
    let elementStyle = props.style ? { ...props.style } : {};

    if (this.context.store.isDragging) {
      wrapperStyle.pointerEvents = "none";
    }

    if (mousePosition || props.style && props.style.position === "absolute") {
      wrapperStyle.position = "absolute";

      const mouseX = mousePosition && mousePosition[0] ? mousePosition[0] : null;
      motionStyles.left = spring(
        mouseX && mouseX || props.style && props.style.left || 0,
        SpringSettings.DRAG
      );
      const mouseY = mousePosition && mousePosition[1] ? mousePosition[1] : null;
      motionStyles.top = spring(
        mouseY && mouseY || props.style && props.style.top || 0,
        SpringSettings.DRAG
      );

      motionStyles.width = spring((width && width || 0), SpringSettings.RESIZE);
      motionStyles.height = spring((height && height || 0), SpringSettings.RESIZE);

      if (mousePosition) {
        wrapperStyle.whiteSpace = "nowrap";
      }

      if (scale) {
        wrapperStyle.transform = `scale(${scale})`;
      }
    }

    elementStyle = { ...elementStyle, position: "relative", left: 0, top: 0 };

    if (isPressed) {
      motionStyles.left = spring((props.style && props.style.left || 0) + x, SpringSettings.DRAG);
      motionStyles.top = spring((props.style && props.style.top || 0) + y, SpringSettings.DRAG);
    }


    if (isResizing) {
      const componentStylesLeft = props.style && props.style.left || 0;
      const componentStylesTop = props.style && props.style.top || 0;

      motionStyles.top = spring(
        top === undefined ? componentStylesTop : top,
        SpringSettings.RESIZE
      );
      motionStyles.left = spring(
        left === undefined ? componentStylesLeft : left,
        SpringSettings.RESIZE
      );
      motionStyles.height = spring(height, SpringSettings.RESIZE);
      motionStyles.width = spring(width, SpringSettings.RESIZE);
    }
    console.log(motionStyles);
    return (
        <Motion
          style={motionStyles}
        >
          {computedStyles => {
            const computedDragStyles = omit(computedStyles, "width", "height");
            let computedResizeStyles = { ...computedStyles };

            if (!isResizing) {
              computedResizeStyles = {};
            }

            return (
              <div
                className={
                  `${styles.canvasElement} ${extraClasses} ${BLACKLIST_CURRENT_ELEMENT_DESELECT}`
                }
                ref={component => {this.currentElementComponent = component;}}
                style={{ ...wrapperStyle, ...computedDragStyles }}
                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleTouchStart}
              >
                {currentlySelected &&
                  <ResizeNode
                    cornerTopLeft
                    ref={component => {this.topLeftNode = ReactDOM.findDOMNode(component);}}
                    handleMouseDownResize={this.handleMouseDownResize}
                    onTouch={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
                {currentlySelected &&
                  <ResizeNode
                    ref={component => {this.leftResizeNode = ReactDOM.findDOMNode(component);}}
                    alignLeft
                    handleMouseDownResize={this.handleMouseDownResize}
                    onTouch={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
                {currentlySelected &&
                  <ResizeNode
                    ref={component => {this.bottomLeftNode = ReactDOM.findDOMNode(component);}}
                    cornerBottomLeft
                    handleMouseDownResize={this.handleMouseDownResize}
                    onTouch={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
                {currentlySelected &&
                  <Arrange />
                }
                  <ComponentClass
                    {...props}
                    className={styles.image}
                    style={{ ...elementStyle, ...computedResizeStyles }}
                  />
                {currentlySelected &&
                  <ResizeNode
                    cornerTopRight
                    ref={component => {this.topRightNode = ReactDOM.findDOMNode(component);}}
                    handleMouseDownResize={this.handleMouseDownResize}
                    onTouch={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
                {currentlySelected &&
                  <ResizeNode
                    alignRight
                    handleMouseDownResize={this.handleMouseDownResize}
                    onTouch={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
                {currentlySelected &&
                  <ResizeNode
                    cornerBottomRight
                    handleMouseDownResize={this.handleMouseDownResize}
                    onTouch={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
              </div>
          );}}
        </Motion>
    );
  }
}
