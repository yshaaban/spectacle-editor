import React, { Component } from "react";
import styles from "./index.css";

export default class SelectBox extends Component {
  render() {
    return(
      <select>
        <option>one</option>
        <option>two</option>
        <option>three</option>
      </select>
    );
  }
}
