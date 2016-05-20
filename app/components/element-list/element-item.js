import React, { Component, PropTypes } from "react";
import { Motion, spring } from "react-motion";

import Elements from "../../elements";
import { ElementTypes } from "../../constants";
import styles from "./element-item.css";

const springSetting2 = { stiffness: 1000, damping: 50 };

const margin = 20;
const top = 25;

class ElementItem extends Component {
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

    if (id === "canvas") {
      newIsOverCanvas = true;
      console.log(offsetX, offsetY);
    }

    if (newIsOverCanvas !== isOverCanvas) {
      this.props.onIsOverChange(newIsOverCanvas);
    }

    this.setState({
      delta: newDelta,
      isOverCanvas: newIsOverCanvas
    });
  }


  handleMouseDown = (ev) => {
    ev.preventDefault();

    const { pageX, pageY } = ev;
    const { offsetTop, offsetLeft } = this.elementSource;
    const element = Elements[this.props.elementType];
    const { width, height } = element;

    // Position the mouse at the center of the element.
    const mouseOffsetX = (width / 2) - pageX + offsetLeft;
    // For some reason offsetTop is off by both top and bottom margins and positioning top
    const mouseOffsetY = (height / 2) - pageY + offsetTop - top - margin - margin;

    console.log(offsetLeft, pageX, offsetTop, pageY);
    console.log(mouseOffsetX, mouseOffsetY);

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

      return;
    }

    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    const state = {
      delta: [0, 0],
      isPressed: false
    };

    this.props.onIsOverChange(false);
    this.props.onIsDraggingChange(false);

    // TODO: allow for animations to take place before updating the store
    this.setState(state, () => {
      setTimeout(() => {
        this.setState({
          mouseOffset: [0, 0],
          mouseStart: [0, 0],
          delta: [0, 0], // difference between mouse and circle pos, for dragging
          isPressed: false
        });
      }, 200);
    });
  }


  render() {
    const { elementType } = this.props;
    const { isPressed, delta: [x, y], mouseOffset: [offsetX, offsetY] } = this.state;
    const element = Elements[elementType];

    console.log(element, Elements, elementType);
    const { ComponentClass, height: elementHeight, width: elementWidth, props, children } = element;

    return (
      <div
        style={{ position: "relative", margin, top, width: 60, height: 25 }}
        ref={(ref) => { this.elementSource = ref; }}
      >
        <Motion
          defaultStyle={{
            translateX: 0,
            translateY: 0,
            height: 0,
            width: 0
          }}
          style={{
            translateX: spring(x - offsetX, springSetting2),
            translateY: spring(y - offsetY, springSetting2),
            height: spring(isPressed ? elementHeight : 0, springSetting2),
            width: spring(isPressed ? elementWidth : 0, springSetting2)
          }}
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
              zIndex: 1000,
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
          <h4 style={{ position: "relative", zIndex: 1001 }}>{elementType}</h4>
        </div>
      </div>
    );
  }
}

ElementItem.propTypes = {
  elementType: PropTypes.string.isRequired
};

export default ElementItem;
