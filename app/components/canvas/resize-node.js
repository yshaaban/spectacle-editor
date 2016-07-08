import React, { Component, PropTypes } from "react";
import styles from "./resize-node.css";

export default class ResizeNode extends Component {
  static propTypes = {
    alignLeft: PropTypes.bool,
    handleMouseDownResize: PropTypes.func,
    handleTouchResize: PropTypes.func
  }

  render() {
    return (
      <div
        className={
          `${styles.handle}
           ${this.props.alignLeft ? styles.handleLeft : styles.handleRight}`
        }
        onMouseDown={this.props.handleMouseDownResize}
        onTouchStart={this.props.handleTouchResize}
      ></div>
    );
  }
}
