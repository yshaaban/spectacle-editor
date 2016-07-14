import React, { Component, PropTypes } from "react";
import styles from "./resize-node.css";

export default class ResizeNode extends Component {
  static propTypes = {
    alignLeft: PropTypes.bool,
    alignRight: PropTypes.bool,
    cornerTopLeft: PropTypes.bool,
    handleMouseDownResize: PropTypes.func,
    handleTouchResize: PropTypes.func
  }

  render() {
    const resolvedClassNames = [
      styles.handle,
      this.props.alignLeft && styles.handleLeft,
      this.props.alignRight && styles.handleRight,
      this.props.cornerTopLeft && styles.cornerTopLeft
    ].join(" ");
    return (
      <div
        className={resolvedClassNames}
        onMouseDown={this.props.handleMouseDownResize}
        onTouchStart={this.props.handleTouchResize}
      ></div>
    );
  }
}
