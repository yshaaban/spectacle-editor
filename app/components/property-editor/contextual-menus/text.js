import React, { Component } from "react";
import styles from "../index.css";
import { autorun } from "mobx";
import {
  Select,
  Option,
  Alignment,
  Formatting,
  List,
  Incrementer
} from "../editor-components/index.js";
import { ElementTypes } from "../../../constants";

export default class TextMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = { currentElement: null };
  }

  componentDidMount() {
    autorun(() => {
      const { currentElement } = this.context.store;

      window.clearTimeout(this.stateTimeout);

      if (!currentElement) {
        this.stateTimeout = window.setTimeout(() => {
          this.setState({ currentElement });
        }, 400);

        return;
      }

      this.setState({ currentElement });
    });
  }

  render() {
    const { currentElement } = this.state;

    return (
      <div className={styles.wrapper}>
        {
          currentElement &&
          currentElement.type === ElementTypes.TEXT &&
          (
          <div>
            <h3 className={styles.heading}>Text</h3>
            <hr />
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Paragraph Styles
              </div>
              <div>
              <Select selectName="month" placeholderText="MM"
                style={{ height: 20 }}
              >
                <Option value="01">01</Option>
                <Option value="02">02</Option>
                <Option value="03">03</Option>
                <Option value="04">04</Option>
              </Select>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Font
              </div>
              <div>
              <Select selectName="month" placeholderText="MM"
                style={{ height: 20 }}
              >
                <Option value="01">01</Option>
                <Option value="02">02</Option>
                <Option value="03">03</Option>
                <Option value="04">04</Option>
              </Select>
              </div>
            </div>
            <div className={styles.flexrow}>
              <div>
                <div className={styles.subHeading}>
                  Size
                </div>
                <Incrementer
                  currentElement={this.state.currentElement}
                  propertyName={"fontSize"}
                />
              </div>
              <div>
                <div className={styles.subHeading}>
                  Color
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Alignment
              </div>
              <Alignment
                currentElement={this.state.currentElement}
              />
            </div>
            <hr className={styles.hr} />
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Formatting
              </div>
              <Formatting
                currentElement={this.state.currentElement}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                List
              </div>
              <List
                currentElement={this.state.currentElement}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
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
