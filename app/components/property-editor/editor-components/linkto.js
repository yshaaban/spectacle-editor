import React, { Component } from "react";
import styles from "./linkto.css";

export default class LinkTo extends Component {
  render() {
    return (
      <input
        className={styles.inputBox}
        placeholder="http://"
        type="text"
      />
    );
  }
}
