import React, { Component } from "react";
import commonStyles from "./common.css";

export default class SlideMenu extends Component {
  render() {
    return (
      <div className={commonStyles.container}>
        <h3 className={commonStyles.heading}>Slides</h3>
      </div>
    );
  }
}
