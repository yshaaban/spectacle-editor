import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";
import { Motion, spring } from "react-motion";
import { omit } from "lodash";

import { ElementTypes, SpringSettings, BLACKLIST_CURRENT_ELEMENT_DESELECT } from "../../constants";
import { getElementDimensions, getPointsToSnap, snap } from "../../utils";
import styles from "./canvas-element.css";
import ResizeNode from "./resize-node";

@observer
class CanvasElement extends Component {
  static propTypes = {
    elementIndex: PropTypes.number,
    component: PropTypes.shape({
      type: PropTypes.oneOf(Object.keys(ElementTypes).map(key => ElementTypes[key])).isRequired,
      ComponentClass: React.PropTypes.any.isRequired,
      props: PropTypes.object,
      children: PropTypes.node
    }).isRequired,
    selected: PropTypes.bool,
    mousePosition: PropTypes.array,
    scale: PropTypes.number,
    showGridLine: PropTypes.func.isRequired,
    hideGridLine: PropTypes.func.isRequired
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

  shouldComponentUpdate() {
    // This is needed because of the way the component is passed down
    // React isn't re-rendering this when the contextual menu updates the store
    return true;
  }

  handleTouchResize = (ev) => {
    ev.preventDefault();
    this.handleMouseResize(ev.touches[0]);
  }

  handleMouseUpResize = (ev) => {
    ev.preventDefault();
    window.removeEventListener("mousemove", this.handleMouseMoveResize);

    this.setState({ isResizing: false });
    // update store
  }

  handleMouseDownResize = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    const { target, pageX } = ev;
    const classString = Array.prototype.join.call(target.classList, "");
    const isLeftSideDrag = classString.indexOf("handleLeft") > -1;
    const boundingBox = this.currentElementComponent.getBoundingClientRect();
    const width = this.state.width ? this.state.width : boundingBox.width;
    const currentElementOffset = isLeftSideDrag ? pageX : pageX + width;

    const updatedState = {
      currentElementOffset,
      isLeftSideDrag,
      isResizing: true,
      resizeLastX: pageX
    };

    if (this.state.width === undefined) {
      updatedState.width = boundingBox.width;
    }

    if (this.state.height === undefined) {
      updatedState.height = boundingBox.height;
    }

    this.setState({ ...updatedState });

    window.addEventListener("mousemove", this.handleMouseMoveResize);
    window.addEventListener("touchmove", this.handleTouchMoveResize);
    window.addEventListener("mouseup", this.handleMouseUpResize);
    window.addEventListener("touchend", this.handleTouchEndResize);
  }

  handleMouseMoveResize = (ev) => {
    ev.preventDefault();
    const { pageX } = ev;
    const { isLeftSideDrag, resizeLastX, width } = this.state;
    const change = pageX - resizeLastX;

    if (!isLeftSideDrag) {
      this.setState({ width: (change + width), resizeLastX: pageX });
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

  handleMouseMove = ({ pageX, pageY, offsetX, offsetY, target }) => {
    const { id } = target;

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
    height = (height === undefined) ?
      this.currentElementComponent.getBoundingClientRect().height :
      height;
    width = (width === undefined) ?
      this.currentElementComponent.getBoundingClientRect().width :
      width;

    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("touchend", this.handleMouseUp);

    // Do this preemptively so that dragging doesn't take the performance hit
    this.gridLines = this.context.store.gridLines;

    // Only do drag if we hold the mouse down for a bit
    this.mouseClickTimeout = setTimeout(() => {
      this.clickStart = null;
      this.mouseClickTimeout = null;

      this.context.store.updateElementDraggingState(true);

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
    console.log("DISCOUNTDOUBLECLICK");
  }

  render() {
    const {
      elementIndex,
      selected,
      component: { type, ComponentClass, props, children },
      mousePosition,
      scale
    } = this.props;

    const {
      width,
      isResizing,
      isPressed,
      delta: [x, y]
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

      motionStyles.left = spring(
        mousePosition ? mousePosition[0] : props.style.left,
        SpringSettings.DRAG
      );

      motionStyles.top = spring(
        mousePosition ? mousePosition[1] : props.style.top,
        SpringSettings.DRAG
      );

      if (mousePosition) {
        wrapperStyle.whiteSpace = "nowrap";
      }

      if (scale) {
        wrapperStyle.transform = `scale(${scale})`;
      }
    }

    elementStyle = { ...elementStyle, position: "relative", left: 0, top: 0 };

    if (this.props.component.props.style.width !== undefined) {
      elementStyle = omit(elementStyle, "whiteSpace");
      elementStyle.wordBreak = "break-all";
    }

    const hiddenElementStyle = omit(elementStyle, "height", "width");

    if (isPressed) {
      motionStyles.left = spring((props.style && props.style.left || 0) + x, SpringSettings.DRAG);
      motionStyles.top = spring((props.style && props.style.top || 0) + y, SpringSettings.DRAG);
    }


    motionStyles.width = spring((width && width || 220), { stiffness: 210, damping: 20 });

    if (isResizing) {
      const propWidth = (props.style && props.style.width) || 0;
      motionStyles.width = spring(Math.round(propWidth + width), { stiffness: 210, damping: 20 });
    }

    return (
        <Motion
          style={motionStyles}
        >
          {computedStyles => {
            const computedDragStyles = omit(computedStyles, "width");
            const computedResizeStyles = omit(computedStyles, "top", "left");

            return (
            <div>
              <div
                ref={component => {this.currentElementComponent = component;}}
                className={styles.hiddenElement}
              >
                {type !== ElementTypes.IMAGE ?
                  <ComponentClass
                    {...props}
                    style={hiddenElementStyle}
                  >
                    {children}
                  </ComponentClass> :
                  <ComponentClass
                    {...props}
                    style={hiddenElementStyle}
                  />
                }
              </div>
              <div
                className={
                  `${styles.canvasElement} ${extraClasses} ${BLACKLIST_CURRENT_ELEMENT_DESELECT}`
                }
                style={{ ...wrapperStyle, ...computedDragStyles }}
                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleTouchStart}
              >
              {currentlySelected &&
                <ResizeNode
                  alignLeft
                  handleMouseDownResize={this.handleMouseDownResize}
                  onTouch={this.handleTouchResize}
                  component={this.props.component}
                />
              }
                {type !== ElementTypes.IMAGE ?
                  <ComponentClass
                    {...props}
                    style={{ ...elementStyle, ...computedResizeStyles }}
                  >
                    {children}
                  </ComponentClass> :
                  <ComponentClass
                    {...props}
                    style={{ ...elementStyle, ...computedResizeStyles }}
                  />
                }
              {currentlySelected &&
                <ResizeNode
                  handleMouseDownResize={this.handleMouseDownResize}
                  onTouch={this.handleTouchResize}
                  component={this.props.component}
                />
              }
              </div>
            </div>
          );}}
        </Motion>
    );
  }
}

export default CanvasElement;
