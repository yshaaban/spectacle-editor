import React, { Component, PropTypes } from "react";
import { Motion, spring } from "react-motion";

import styles from "./element-item.css";

const springSetting2 = { stiffness: 1000, damping: 50 };

// Move to inside element info
const elementHeight = 100;
const elementWidth = 100;
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
    const { mouseStart: [x, y] } = this.state;
    const newDelta = [pageX - x, pageY - y];

    if (id === "canvas") {
      console.log(offsetX, offsetY);
    }

    this.setState({
      delta: newDelta
    });
  }


  handleMouseDown = (ev) => {
    ev.preventDefault();

    const { pageX, pageY } = ev;
    const { offsetTop, offsetLeft } = this.elementSource;

    // Position the mouse at the center of the element.
    const mouseOffsetX = (elementWidth / 2) - pageX + offsetLeft;
    // For some reason offsetTop is off by both top and bottom margins and positioning top
    const mouseOffsetY = (elementHeight / 2) - pageY + offsetTop - top - margin - margin;

    console.log(offsetLeft, pageX, offsetTop, pageY);
    console.log(mouseOffsetX, mouseOffsetY);

    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("touchend", this.handleMouseUp);

    // Only do drag if we hold the mouse down for a bit
    this.mouseClickTimeout = setTimeout(() => {
      this.mouseClickTimeout = null;

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
            height: spring(isPressed ? 100 : 0, springSetting2),
            width: spring(isPressed ? 100 : 0, springSetting2)
          }}
        >
          {({ height, width, translateY, translateX }) => (
            <div
              style={{
                height,
                width,
                transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
                zIndex: 1000,
                position: "absolute",
                backgroundColor: "#fff",
                pointerEvents: "none"
              }}
            >
            </div>
          )}
        </Motion>
        <div
          className={styles.item}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
        >
          <h4 style={{ position: "relative", zIndex: 1001, }}>{elementType}</h4>
        </div>
      </div>
    );
  }
}

ElementItem.propTypes = {
  elementType: PropTypes.string.isRequired
};

export default ElementItem;
