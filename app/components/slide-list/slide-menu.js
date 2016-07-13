import React, { Component, PropTypes } from "react";
import { NEWSLIDE, DELETESLIDE } from "../../assets/icons";

import styles from "./slide-menu.css";

class SlideMenu extends Component {
  static contextTypes = {
    store: PropTypes.object
  };

  onClickAddSlide = () => {
    this.context.store.addSlide();
  }

  onClickDeleteSlide = () => {
    this.context.store.deleteSlide();
  }

  render() {
    return (
      <div className={styles.slideMenu}>
        <button
          className={styles.slideButton}
          onClick={this.onClickAddSlide}
        >
          <i
            className={styles.icon}
            dangerouslySetInnerHTML={ { __html: NEWSLIDE } }
          />
          New Slide
        </button>
        <button
          className={styles.slideButton}
          onClick={this.onClickDeleteSlide}
        >
          <i
            className={styles.icon}
            dangerouslySetInnerHTML={ { __html: DELETESLIDE } }
          />
          Delete Slide
        </button>
      </div>
    );
  }
}

export default SlideMenu;
