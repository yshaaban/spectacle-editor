import React, { Component } from "react";
import styles from "../index.css";
import Alignment from "../editor-icons/alignment";
import Formatting from "../editor-icons/formatting";
import List from "../editor-icons/list";

export default class TextMenu extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <h3 className={styles.heading}>Text</h3>
        <hr />
        <div className={styles.row}>
          <div>
            Styles
          </div>
          <select>
            <option className={styles.dropdown}>Heading 1</option>
          </select>
        </div>
        <div className={styles.flexrow}>
          <div>
            <div>Size</div>
            <select>
              <option>
                72px
              </option>
            </select>
          </div>
          <div>
            <div>Color</div>
            <input type="number" />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            Alignment
          </div>
          <Alignment />
        </div>
        <hr className={styles.hr} />
        <div className={styles.row}>
          <div>
            Formatting
          </div>
          <Formatting />
        </div>
        <div className={styles.row}>
          <div>
            List
          </div>
          <List />
        </div>
        <div className={styles.row}>
          <div>
            Link
          </div>
          <input type="text" />
        </div>
      </div>
    );
  }
}
