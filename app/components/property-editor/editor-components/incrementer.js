import React, { Component } from "react";
import { CARET } from "../../../assets/icons";
import styles from "./index.css";
import { get } from "lodash";

export default class Incrementer extends Component {
  static propTypes = {
    propertyName: React.PropTypes.string
  };

  static contextTypes = {
    store: React.PropTypes.object
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleCursorPosition = this.handleCursorPosition.bind(this);
  }

  updateStore(updatedValue) {
    const { currentElement } = this.context.store;
    const { style } = currentElement.props;
    const updatedProperty = updatedValue ? `${updatedValue}px` : "";
    const updatedStyleProp = {};
    updatedStyleProp[this.props.propertyName] = updatedProperty;
    const updatedStyles = Object.assign({}, style, updatedStyleProp);
    this.context.store.updateElementProps({ style: updatedStyles });
  }

  handleIncrement(num) {
    const { propertyName } = this.props;
    const { currentElement } = this.context.store;
    const property = currentElement.props.style[propertyName];
    const parsedProperty = property.match(/[0-9]*/)[0];
    return () => {
      this.updateStore(parseInt(parsedProperty, 10) + num);
    };
  }

  handleChange(ev) {
    const value = parseInt(ev.target.value.match(/[0-9]*/)[0], 10);
    const result = isNaN(value) ? "" : value;
    this.updateStore(result);
  }

  handleCursorPosition(ev) {
    const { value } = ev.target;
    const numLength = value.match(/[0-9]*/)[0].length;
    ev.target.setSelectionRange(0, numLength);
  }
  render() {
    const { currentElement } = this.context.store;
    const property = get(currentElement.props.style, this.props.propertyName);
    return (
      <div className={styles.incrementerWrapper}>
        <input type="text"
          onFocus={this.handleCursorPosition}
          value={property || ""}
          onChange={this.handleChange}
        />
        <span>
          <div
            onClick={this.handleIncrement(1)}
            className={styles.incrementUp}
            dangerouslySetInnerHTML={{ __html: CARET }}
          >
          </div>
          <div
            onClick={this.handleIncrement(-1)}
            className={styles.incrementDown}
            dangerouslySetInnerHTML={{ __html: CARET }}
          >
          </div>
        </span>
      </div>
    );
  }
}
