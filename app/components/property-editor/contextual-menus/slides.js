import React, { Component } from "react";
import styles from "../index.css";

export default class SlideMenu extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <i className={`icon ion-ios-checkmark-empty`}></i>
        <h3 className={styles.heading}>Slides</h3>
      </div>
    );
  }
}
