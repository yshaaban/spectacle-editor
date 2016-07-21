import React, { Component } from "react";
import styles from "./linkto.css";

export default class LinkTo extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  static propTypes = {
    currentElement: React.PropTypes.object
  }

  handleChange = (ev) => {
    console.log(ev);
    const value = ev.target.value;
    console.log("value", value);
  }


  handleCursorPosition(ev) {
    const { value } = ev.target;
    const numLength = value.length;

    ev.target.setSelectionRange(0, numLength);
  }

  render() {
    return (
      <div>
        <i className={`ion-link`} />
        <input
          className={`globalInput ${styles.input}`}
          placeholder="http://"
          type="text"
          onChange={this.handleChange}
          onFocus={this.handleCursorPosition}
        />
      </div>
    );
  }
}
