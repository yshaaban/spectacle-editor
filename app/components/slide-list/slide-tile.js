import React, { Component, PropTypes } from "react";

import styles from "./slide-tile.css";

class SlideTile extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  render() {
    return (
      <div className={styles.slideTile}>
        {this.props.id}
      </div>
    );
  }
}

SlideTile.propTypes = {};

export default SlideTile;
