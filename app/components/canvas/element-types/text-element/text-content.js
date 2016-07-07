import React, { Component } from "react";

export default class TextContent extends Component {
  static propTypes = {
    styles: React.PropTypes.object,
    mouseHandler: React.PropTypes.func,
    touchHandler: React.PropTypes.func,
    children: React.PropTypes.node
  }

  render() {
    const { styles, mouseHandler, touchHandler } = this.props;

    return (
      <div
        style={styles}
        onMouseDown={mouseHandler}
        onTouchStart={touchHandler}
      >
        {this.props.children}
      </div>
    );
  }
}
