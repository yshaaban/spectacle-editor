import React, { Component } from "react";
import { BOLD, ITALIC, QUOTE, UNDERLINE } from "../../../assets/icons";
import styles from "./formatting.css";

export default class Formatting extends Component {
  render() {
    return (
      <div className={styles.formattingWrapper}>
        <span
          className={styles.formattingBox}
          dangerouslySetInnerHTML={{ __html: BOLD }}
        >
        </span>
        <span
          className={styles.formattingBox}
          dangerouslySetInnerHTML={{ __html: ITALIC }}
        >
        </span>
        <span
          className={styles.formattingBox}
          dangerouslySetInnerHTML={{ __html: UNDERLINE }}
        >
        </span>
        <span
          className={styles.formattingBox}
          dangerouslySetInnerHTML={{ __html: QUOTE }}
        >
        </span>
      </div>
    );
  }
}
