import React, { Component } from "react";

import Slide from "./slide";
import styles from "./index.css";

class SlideList extends Component {
  render() {
    return (
      <div className={styles.canvas}>
        <div className={styles.slideWrapper}>
          <div className={styles.slideContent}>
            <Slide />
          </div>
        </div>
      </div>
    );
  }
}

export default SlideList;
