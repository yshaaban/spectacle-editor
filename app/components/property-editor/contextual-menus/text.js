import React, { Component } from "react";
import styles from "./text.css";
import commonStyles from "./common.css";

export default class TextMenu extends Component {
  render() {
    return (
      <div className={commonStyles.container}>
        <h3 className={commonStyles.heading}>Text</h3>
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
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
        </div>
        <div className={styles.row}>
          <div>
            Formatting
          </div>
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
        </div>
        <div className={styles.row}>
          <div>
            List
          </div>
          <input type="radio" />
          <input type="radio" />
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
