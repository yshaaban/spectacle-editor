import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Motion, spring } from "react-motion";
import { omit, defer } from "lodash";

import {
  SpringSettings,
  BLACKLIST_CURRENT_ELEMENT_DESELECT
} from "../../../../constants";
import { getPointsToSnap, snap } from "../../../../utils";
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

  componentWillReceiveProps() {
    const { isDragging, isResizing } = this.context.store;

    if (!isDragging && !isResizing) {
      // defer measuring new height and width, otherwise value will be what height was before resize
      defer(() => {
        if (this.editable) {
          this.setState({
            width: this.editable.clientWidth,
            height: this.editable.clientHeight
          });
        }
      });
    }
  }

  shouldComponentUpdate() {
    // This is needed because of the way the component is passed down
    // React isn't re-rendering this when the contextual menu updates the store
    return true;
  }

  getCursorTypes(el) {
    if (el === this.leftResizeNode || el === this.rightResizeNode) {
      return "ew-resize";
    }

    if (el === this.topLeftNode || el === this.bottomRightNode) {
      return "nwse-resize";
    }

    if (el === this.topRightNode || el === this.bottomLeftNode) {
      return "nesw-resize";
    }
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
    const horizontalResize =
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

    this.context.store.updateElementResizeState(true, this.getCursorTypes(currentTarget));

    this.setState({
      isTopDrag,
      isLeftSideDrag,
      horizontalResize,
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
      resizeLastY,
      isTopDrag,
      horizontalResize
    } = this.state;

    let { height, width, left, top } = this.state;
    let verticalSnap = false;
    let horizontalSnap = false;

    const createSnapCallback = (isVertical, length, offset) => (line, index) => {
      if (line === null) {
        this.props.hideGridLine(isVertical);

        if (isVertical) {
          verticalSnap = false;
        } else {
          horizontalSnap = false;
        }

        return;
      }

      let pointToAlignWithLine;

      if (index === 0) {
        pointToAlignWithLine = offset;
      }

      if (index === 1) {
        pointToAlignWithLine = Math.ceil(offset + length / 2);
      }

      if (index === 2) {
        pointToAlignWithLine = Math.ceil(offset + length);
      }

      const distance = pointToAlignWithLine - line;

      if (Math.abs(distance) <= 7) {
        if (!isVertical) {
          if (isTopDrag) {
            top -= distance;
            height += distance;
          } else {
            height -= distance;
          }
          horizontalSnap = true;
        }

        if (isVertical) {
          if (isLeftSideDrag) {
            left -= distance;
            width += distance;
          } else {
            width -= distance;
          }
          verticalSnap = true;
        }

        this.props.showGridLine(line, isVertical);
      }
    };

    snap(
      this.gridLines.vertical,
      getPointsToSnap(
        left,
        width,
        (Math.max(pageX, resizeLastX) - Math.min(pageX, resizeLastX)) / 2
      ),
      createSnapCallback(true, width, left)
    );

    const delta = [];

    if (isLeftSideDrag) {
      delta[0] = resizeLastX - pageX;
      left = verticalSnap ? left : left - delta[0];
    } else {
      delta[0] = pageX - resizeLastX;
    }

    let nextState = {};
    let newWidth = delta[0] + width;

    newWidth = verticalSnap ? width : newWidth;

    if (newWidth >= 0) {
      nextState = {
        left,
        width: newWidth,
        resizeLastX: verticalSnap ? resizeLastX : pageX
      };
    }

    if (horizontalResize) {
      snap(
        this.gridLines.horizontal,
        getPointsToSnap(
          top,
          height,
          (Math.max(pageY, resizeLastY) - Math.min(pageY, resizeLastY)) / 2
        ),
        createSnapCallback(false, height, top)
      );

      const { component: { props } } = this.props;

      if (isTopDrag) {
        delta[1] = resizeLastY - pageY;

        if (!horizontalSnap) {
          top = this.shiftHeld ?
            top - ((delta[0] + (props.height * newWidth) / props.width) - height)
            :
            top - delta[1];
        }
      } else {
        delta[1] = pageY - resizeLastY;
      }

      let newHeight = this.shiftHeld ?
        (delta[0] + (props.height * newWidth) / props.width)
        :
        (delta[1] + height);

      newHeight = horizontalSnap ? height : newHeight;

      if (newHeight >= 0) {
        nextState = {
          ...nextState,
          top,
          height: newHeight,
          resizeLastY: horizontalSnap ? resizeLastY : pageY
        };
      }
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
    this.props.hideGridLine(false);

    this.context.store.updateElementResizeState(false);

    const { width, left, top, height } = this.state;
    const propStyles = { ...this.props.component.props.style, width, left, top, height };

    this.context.store.updateElementProps({ style: propStyles });
  }

  handleKeyDown = (ev) => {
    if (ev.shiftKey) {
      window.addEventListener("keyup", this.handleKeyUp);
      this.shiftHeld = true;
    }
  }

  handleKeyUp = (ev) => {
    if (!ev.shiftKey) {
      window.removeEventListener("keyup", this.handleKeyUp);
      this.shiftHeld = false;
    }
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

    if (this.context.store.currentElementIndex === this.props.elementIndex) {
      this.clickStart = new Date().getTime();
    }

    this.context.store.setCurrentElementIndex(this.props.elementIndex);

    const { pageX, pageY } = ev;
    const boundingBox = this.currentElementComponent.getBoundingClientRect();
    const mouseOffset = [Math.floor(boundingBox.left - pageX), Math.floor(boundingBox.top - pageY)];
    const originalPosition = [
      this.props.component.props.style.left,
      this.props.component.props.style.top
    ];
    const { width, height } = boundingBox;

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

    const { isDragging, isResizing, cursorType, currentElementIndex } = this.context.store;

    if (currentElementIndex === elementIndex) {
      window.addEventListener("keydown", this.handleKeyDown);
    } else {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("keyup", this.handleKeyUp);
    }

    if (isDragging) {
      wrapperStyle.pointerEvents = "none";
    }

    if (isResizing) {
      this.currentElementComponent.style.cursor = cursorType;
    } else if (this.currentElementComponent) {
      this.currentElementComponent.style.cursor = "auto";
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

    return (
        <Motion
          style={motionStyles}
        >
          {computedStyles => {
            const computedDragStyles = omit(computedStyles, "width", "height");
            let computedResizeStyles = omit(computedStyles, "top", "left");

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
                {currentlySelected && !isResizing && !isDragging &&
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
                    ref={component => {this.rightResizeNode = ReactDOM.findDOMNode(component);}}
                    handleMouseDownResize={this.handleMouseDownResize}
                    onTouch={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
                {currentlySelected &&
                  <ResizeNode
                    ref={component => {this.bottomRightNode = ReactDOM.findDOMNode(component);}}
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
