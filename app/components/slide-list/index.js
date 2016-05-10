import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { observer } from "mobx-react";
import { Motion, spring } from "react-motion";

import SlideTile from "./slide-tile";
import styles from "./index.css";

const allColors = [
  '#EF767A', '#456990', '#49BEAA', '#49DCB1', '#EEB868', '#EF767A', '#456990',
  '#49BEAA', '#49DCB1', '#EEB868', '#EF767A',
];

const height = 65;

const springSetting1 = {stiffness: 180, damping: 10};
const springSetting2 = {stiffness: 1000, damping: 50};

@observer
class SlideList extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props);

    this.state = {
      slideList: context.store.slides,
      boundingRect: null,
      mouseStart: [0, 0],
      delta: [0, 0], // difference between mouse and circle pos, for dragging
      outside: false, // index of component outside
      isPressed: false
    };
  }

  handleTouchStart = (id, pressLocation, ev) => {
    this.handleMouseDown(id, pressLocation, ev.touches[0]);
  }

  handleTouchMove = (ev) => {
    ev.preventDefault();
    this.handleMouseMove(ev.touches[0]);
  }

  handleMouseMove = ({ pageX, pageY }) => {
    const { mouseOffset, mouseStart: [x, y] } = this.state;

    const newList = this.context.store.slides.concat();

    const newDelta = [pageX - x, pageY - y];

    // If we're outside of the column, setState to outside
    // TODO: GET ACTUAL COLUMN COORDINATES, use list boundingRect and slide bounding rect
    if (pageX > 155 || pageY > 900) {
      this.setState({
        delta: newDelta,
        outside: true
      });

      return;
    }

    // Figure out where this slide belongs
    // THIS ASSUMES SLIDE LIST STARTS AT THE TOP OF THE PAGE
    const topOfSlide = pageY + mouseOffset.top;

    let newIndex = Math.floor(topOfSlide / height);

    if (newIndex > newList.length) {
      newIndex = newList.length - 1;
    }

    this.setState({
      delta: newDelta,
      currentDragIndex: newIndex,
      outside: false
    });
  }

  handleMouseDown = (id, index, ev) => {
    ev.preventDefault();

    const { pageX, pageY } = ev;
    const { top, right, bottom, left } = this[id].getBoundingClientRect();

    this.setState({
      originalDragIndex: index,
      currentDragIndex: index,
      mouseOffset: {
        top: top - pageY,
        right: right - pageX,
        bottom: bottom - pageY,
        left: left - pageX
      },
      delta: [0, 0],
      mouseStart: [pageX, pageY],
    });

    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleMouseUp);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseUp = () => {
    this.setState({
      originalDragIndex: null,
      currentDragIndex: null,
      outside: false,
      boundingRect: null,
      delta: [0, 0]
    });

    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  // onMoveSlide = (originalIndex, newIndex) => {
  //   // this.context.store.moveSlide(originalIndex, newIndex);
  // }

  // onDropSlide = (originalIndex, newIndex) => {
  //   // TODO: Commit to history here
  // }



  render() {
    const { slideList, currentDragIndex, delta, outside, originalDragIndex } = this.state;

    // If we're outside the column, fill in the vacant spot
    let visualIndex = 0;

    return (
      <div className={styles.list}>
        {slideList.map((slide, i) => {
          let style;
          let x;
          let y;

          // Leave a space in this location if we're within column bounds
          if (!outside && i === currentDragIndex) {
            visualIndex += 1;
          }

          console.log("CURRENT INDEX", currentDragIndex);
          if (i === originalDragIndex) {
            [x, y] = delta;

            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1.2, springSetting1),
            };
          } else {
            y = (visualIndex - i) * height;
            visualIndex += 1;

            style = {
              translateX: spring(0, springSetting2),
              translateY: spring(y, springSetting2),
              scale: 1,
            };
          }

          return (
            <Motion key={slide.id} style={style}>
              {({ translateY, translateX, scale }) => (
                <div
                  className={styles.slideWrapper}
                  ref={(ref) => { this[slide.id] = ref; }}
                  key={slide.id}
                  onMouseDown={this.handleMouseDown.bind(this, slide.id, i)}
                  onTouchStart={this.handleTouchStart.bind(this, slide.id, i)}
                  style={{
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                  }}
                >
                  <div className={styles.slideThumb}>{slide.id}</div>
                </div>
              )}
            </Motion>
          );
        })}
      </div>
    );
  }
}

export default SlideList;
