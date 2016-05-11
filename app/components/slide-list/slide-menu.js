import React, { Component, PropTypes } from "react";

import styles from "./slide-menu.css";

class SlideMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
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
        <button onClick={this.onClickAddSlide}>New Slide</button>
        <button onClick={this.onClickDeleteSlide}>Delete</button>
      </div>
    );
  }
}

export default SlideMenu;
