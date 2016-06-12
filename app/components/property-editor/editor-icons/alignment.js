import React, { Component } from "react";
import { ALIGNLEFT, ALIGNCENTER, ALIGNRIGHT } from "../../../assets/icons";
import styles from "./index.css";

export default class Alignment extends Component {
  render() {
    return (
      <div className={styles.alignmentWrapper}>
        <span dangerouslySetInnerHTML={{ __html: ALIGNLEFT }}></span>
        <span dangerouslySetInnerHTML={{ __html: ALIGNCENTER }}></span>
        <span dangerouslySetInnerHTML={{ __html: ALIGNRIGHT }}></span>
      </div>
      );
  }
}
