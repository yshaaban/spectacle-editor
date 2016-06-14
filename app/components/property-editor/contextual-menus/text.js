import React, { Component } from "react";
import styles from "../index.css";
import { Alignment, Formatting, List, Incrementer } from "../editor-components/index.js";
import { ElementTypes } from "../../../constants";
export default class TextMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  render() {
    const { store } = this.context;

    return (
      <div className={styles.wrapper}>
        {
          store &&
          store.currentElement &&
          store.currentElement.type === ElementTypes.TEXT &&
          (
          <div>
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
                <Incrementer propertyName={"fontSize"} />
              </div>
              <div>
                <div>Color</div>
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
        )}
      </div>
    );
  }
}