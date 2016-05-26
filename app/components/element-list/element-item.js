import React, { Component, PropTypes } from "react";
import { Motion, spring } from "react-motion";

import { SpringSettings, IconTypes } from "../../constants";
import Icon from "../icon";
import styles from "./element-item.css";

const addedPadding = 2;

class ElementItem extends Component {
  static propTypes = {
    elementType: PropTypes.string.isRequired,
    onIsDraggingChange: PropTypes.func.isRequired,
    onIsOverCanvasChange: PropTypes.func.isRequired,
    elementLeft: PropTypes.number.isRequired,
    elementTop: PropTypes.number.isRequired,
    elementWidth: PropTypes.number.isRequired,
    elementHeight: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      delta: [0, 0],
      mouseStart: [0, 0],
      mouseOffset: [0, 0],
      isPressed: false
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
    const { mouseStart: [x, y], isOverCanvasPosition } = this.state;
    const newDelta = [pageX - x, pageY - y];

    let isUpdating = false;
    let newOverCanvasPosition = null;

    if (id === "canvas") {
      newOverCanvasPosition = [offsetX, offsetY];

    // Switching from canvas element back to icon, do not animate icon
    } else if (isOverCanvasPosition !== null) {
      console.log("HERERE");
      isUpdating = true;
    }

    this.props.onIsOverCanvasChange(newOverCanvasPosition, this.props.elementType);

    this.setState({
      delta: newDelta,
      // TODO: Clean up these two properties
      canvasOffset: [offsetX, offsetY],
      isOverCanvasPosition: newOverCanvasPosition,
      isUpdating
    }, () => {
      this.setState({
        isUpdating: false
      });
    });
  }


  handleMouseDown = (ev) => {
    ev.preventDefault();

    const { pageX, pageY } = ev;

    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("touchend", this.handleMouseUp);

    // Only do drag if we hold the mouse down for a bit
    this.mouseClickTimeout = setTimeout(() => {
      this.mouseClickTimeout = null;

      this.props.onIsDraggingChange(true);

      this.setState({
        mouseOffset: [(addedPadding / 2), (addedPadding / 2)],
        delta: [0, 0],
        mouseStart: [pageX, pageY],
        isPressed: true
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

      this.props.onDropElement(this.props.elementType);

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
      isPressed: false
    };

    this.props.onIsOverCanvasChange(null, null);
    this.props.onIsDraggingChange(false);

    if (this.state.isOverCanvasPosition) {
      // Don't show return animation if dropping the element on the canvas
      state.isUpdating = true;

      this.props.onDropElement(this.props.elementType, [
        this.state.canvasOffset[0],
        this.state.canvasOffset[1]
      ]);
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

    const {
      isUpdating,
      isOverCanvasPosition,
      isPressed,
      delta: [x, y],
      mouseOffset: [offsetX, offsetY]
    } = this.state;

    const motionStyles = {
      translateX: spring(x - offsetX, SpringSettings.DRAG),
      translateY: spring(y - offsetY, SpringSettings.DRAG),
      opacity: spring(isPressed ? 1 : 0, SpringSettings.DRAG),
      padding: spring(isPressed ? 2 : 0, SpringSettings.DRAG)
    };

    if (isUpdating) {
      motionStyles.translateX = isPressed ? x - offsetX : 0;
      motionStyles.translateY = isPressed ? y - offsetY : 0;
      motionStyles.padding = isPressed ? addedPadding : 0;
      motionStyles.opacity = 1;
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
        {!isOverCanvasPosition &&
          <Motion
            defaultStyle={isUpdating ? motionStyles : {
              translateX: 0,
              translateY: 0,
              padding: 0,
              opacity: 0
            }}
            style={motionStyles}
          >
            {({ translateY, translateX, opacity, padding }) => {
              const dragIconStyles = {
                overflow: "hidden",
                transform: `
                  translate3d(${translateX}px,
                  ${translateY}px, 0)
                `,
                zIndex: 1002,
                position: "absolute",
                pointerEvents: "none",
                backgroundColor: "#fff",
                opacity,
                padding
              };

              return <Icon name={IconTypes.TEXT} className={styles.icon} style={dragIconStyles} />;
            }}
          </Motion>
        }
        <div
          className={styles.item}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
        >
          <Icon name={IconTypes.TEXT} className={styles.icon} />
          <h4 style={{ position: "relative", zIndex: 1001, pointerEvents: "none" }}>
            {elementType}
          </h4>
        </div>
      </div>
    );
  }
}

export default ElementItem;
