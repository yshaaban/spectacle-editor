import React, { Component, PropTypes } from "react";
import { Motion, spring } from "react-motion";

import Elements from "../../elements";
import { ElementTypes } from "../../constants";
import styles from "./element-item.css";

const springSetting2 = { stiffness: 1000, damping: 50 };

class ElementItem extends Component {
  static propTypes = {
    elementType: PropTypes.string.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      delta: [0, 0],
      isPressed: false,
      mouseStart: [0, 0],
      mouseOffset: [0, 0]
    };
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
    const { mouseStart: [x, y], isOverCanvas } = this.state;
    const newDelta = [pageX - x, pageY - y];

    let newIsOverCanvas = false;
    let newIsOverSlide = false;

    if (id === "canvas") {
      newIsOverCanvas = true;
    }

    if (id === "slide") {
      newIsOverSlide = true;
      newIsOverCanvas = true;
    }

    if (newIsOverCanvas !== isOverCanvas) {
      this.props.onIsOverCanvasChange(newIsOverCanvas);
    }

    this.setState({
      delta: newDelta,
      isOverCanvas: newIsOverCanvas,
      isOverSlide: newIsOverSlide,
      canvasOffset: [offsetX, offsetY]
    });
  }


  handleMouseDown = (ev) => {
    ev.preventDefault();

    const { pageX, pageY } = ev;
    const { elementLeft, elementTop, elementType, scale } = this.props;
    const element = Elements[elementType];
    const { width, height } = element;

    // Position the mouse at the center of the element.
    const mouseOffsetX = (width / 2) - pageX + elementLeft;
    const mouseOffsetY = (height / 2) - pageY + elementTop;

    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("touchend", this.handleMouseUp);

    // Only do drag if we hold the mouse down for a bit
    this.mouseClickTimeout = setTimeout(() => {
      this.mouseClickTimeout = null;

      this.props.onIsDraggingChange(true);

      this.setState({
        mouseOffset: [mouseOffsetX, mouseOffsetY],
        delta: [0, 0],
        mouseStart: [pageX, pageY],
        isPressed: true
      });

      window.addEventListener("touchmove", this.handleTouchMove);
      window.addEventListener("mousemove", this.handleMouseMove);
    }, 300);
  }

  handleMouseUp = () => {
    if (this.mouseClickTimeout || this.mouseClickTimeout === 0) {
      clearTimeout(this.mouseClickTimeout);
      window.removeEventListener("mouseup", this.handleMouseUp);
      window.removeEventListener("touchend", this.handleMouseUp);

      this.mouseClickTimeout = null;

      this.context.store.dropElement(this.props.elementType);

      return;
    }

    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    const state = {
      delta: [0, 0],
      mouseOffset: [0, 0],
      mouseStart: [0, 0],
      canvasOffset: [0, 0],
      isOverCanvas: false,
      isOverSlide: false,
      isPressed: false
    };

    this.props.onIsOverCanvasChange(false);
    this.props.onIsDraggingChange(false);

    if (this.state.isOverSlide) {
      const element = Elements[this.props.elementType];
      const { height, width } = element;

      // Don't show return animation if dropping the element on the canvas
      state.isUpdating = true;
      this.context.store.dropElement(this.props.elementType, /* props */{
        style: {
          position: "absolute",
          left: this.state.canvasOffset[0] - (width / 2),
          top: this.state.canvasOffset[1] - (height / 2)
        }
      });
    }

    this.setState(state, () => {
      setTimeout(() => {
        this.setState({
          isUpdating: false
        });
      }, 1);
    });
  }


  render() {
    const {
      elementType,
      elementLeft,
      elementTop,
      elementWidth,
      elementHeight
    } = this.props;
    const { isPressed, isUpdating, delta: [x, y], mouseOffset: [offsetX, offsetY] } = this.state;
    const element = Elements[elementType];

    const { ComponentClass, height: draggingHeight, width: draggingWidth, props, children } = element;

    let motionStyles = {
      translateX: spring(x - offsetX, springSetting2),
      translateY: spring(y - offsetY, springSetting2),
      height: spring(isPressed ? draggingHeight : 0, springSetting2),
      width: spring(isPressed ? draggingWidth : 0, springSetting2)
    };

    if (isUpdating) {
      motionStyles.translateX = 0;
      motionStyles.translateY = 0;
      motionStyles.height = 0;
      motionStyles.width = 0;
    }

    return (
      <div
        className={styles.wrapper}
        style={{
          left: elementLeft,
          top: elementTop,
          width: elementWidth,
          height: elementHeight
        }}
      >
        <Motion
          defaultStyle={{
            translateX: 0,
            translateY: 0,
            height: 0,
            width: 0
          }}
          style={motionStyles}
        >
          {({ height, width, translateY, translateX }) => {
            const elementStyles = {
              ...props.style,
              overflow: "hidden",
              height,
              width,
              transform: `
                translate3d(${translateX}px,
                ${translateY}px, 0)
                scale(${this.props.scale})
              `,
              zIndex: 1002,
              position: "absolute",
              backgroundColor: "#fff",
              pointerEvents: "none"
            };

            if (elementType !== ElementTypes.IMAGE || elementType !== ElementTypes.PLOTLY) {
              return (
                <ComponentClass {...props} style={{ ...props.style, ...elementStyles }}>
                  {children}
                </ComponentClass>
              );
            }

            return <ComponentClass {...props} style={elementStyles} />;
          }}
        </Motion>
        <div
          className={styles.item}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
        >
          <h4 style={{ position: "relative", zIndex: 1001, pointerEvents: "none" }}>
            {elementType}
          </h4>
        </div>
      </div>
    );
  }
}

export default ElementItem;
