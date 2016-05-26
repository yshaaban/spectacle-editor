import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";

import CanvasElement from "./canvas-element";
import styles from "./slide.css";

@observer
class Slide extends Component {
  static propTypes = {
    isDragging: PropTypes.bool.isRequired,
    isOver: PropTypes.bool.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  render() {
    const { isOver } = this.props;
    const { store: { currentSlide, isDragging } } = this.context;

    let slideClass = styles.slide;

    if (isDragging) {
      slideClass += ` ${styles.isDragging}`;
    }

    if (isOver) {
      slideClass += ` ${styles.isOver}`;
    }

    return (
      <div className={slideClass} id="slide">
        {currentSlide && currentSlide.children.map((childObj, i) => (
          <CanvasElement
            key={childObj.id}
            component={childObj}
            elementIndex={i}
            isDragging={isDragging}
          />
        ))}
      </div>
    );
  }
}

export default Slide;
