import React, { Component } from "react";
import styles from "./list.css";

          // dangerouslySetInnerHTML={{ __html: ALIGNLEFT }}
export default class List extends Component {
  render() {
    return (
      <div className={styles.listWrapper}>
        <span
          className={`octicon octicon-list-unordered ${styles.listBox}`}
        >
        </span>
        <span
          className={`octicon octicon-list-ordered ${styles.listBox}`}
        >
        </span>
      </div>
    );
  }
}
