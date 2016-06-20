import React, { Component } from "react";

import { EYEDROPPER } from "../../../assets/icons";
import styles from "./colorpicker.css";

export default class ColorPicker extends Component {
  render() {
    return (
      <div className={styles.colorWrapper}>
        <div className={styles.colorPicker}>
          &nbsp;
        </div>
        <div
          className={styles.dropper}
          dangerouslySetInnerHTML={{ __html: EYEDROPPER }}
        >
        </div>
      </div>
    );
  }
}
