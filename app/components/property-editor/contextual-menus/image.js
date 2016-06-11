import React, { Component } from "react";
import commonStyles from "./common.css";

export default class ImageMenu extends Component {
  render() {
    return (
      <div className={commonStyles.container}>
        <h3 className={commonStyles.heading}>Image</h3>
      </div>
    );
  }
}
