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

  constructor(props, context) {
    super(props, context);

    this.state = {
      verticalGridLine: null,
      horizontalGridLine: null
    };
  }

  showGridLine = (location, isVertical) => {
    if (isVertical) {
      this.setState({ verticalGridLine: location });
    } else {
      this.setState({ horizontalGridLine: location });
    }
  }

  hideGridLine = (isVertical) => {
    if (isVertical) {
      this.setState({ verticalGridLine: null });
    } else {
      this.setState({ horizontalGridLine: null });
    }
  }

  render() {
    const { isOver } = this.props;
    const { store: { currentSlide, isDragging } } = this.context;
    const { verticalGridLine, horizontalGridLine } = this.state;

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
            showGridLine={this.showGridLine}
            hideGridLine={this.hideGridLine}
          />
        ))}
        {(verticalGridLine === 0 || verticalGridLine) && <div style={{
          position: "absolute",
          borderRight: "1px solid rgba(0, 191, 239, 0.5)",
          top: 0,
          left: verticalGridLine,
          bottom: 0,
          width: 0,
          pointerEvents: "none"
        }} />}
        {(horizontalGridLine === 0 || horizontalGridLine) && <div style={{
          position: "absolute",
          borderBottom: "1px solid rgba(0, 191, 239, 0.5)",
          top: horizontalGridLine,
          left: 0,
          right: 0,
          height: 0,
          pointerEvents: "none"
        }} />}
      </div>
    );
  }
}

export default Slide;
