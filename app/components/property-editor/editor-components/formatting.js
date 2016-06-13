import React, { Component } from "react";
import { BOLD, ITALIC, QUOTE, UNDERLINE } from "../../../assets/icons";
import styles from "./index.css";

export default class Formatting extends Component {
  render() {
    return (
      <div className={styles.formattingWrapper}>
        <span dangerouslySetInnerHTML={{ __html: BOLD }}></span>
        <span dangerouslySetInnerHTML={{ __html: ITALIC }}></span>
        <span dangerouslySetInnerHTML={{ __html: UNDERLINE }}></span>
        <span dangerouslySetInnerHTML={{ __html: QUOTE }}></span>
      </div>
    );
  }
}
