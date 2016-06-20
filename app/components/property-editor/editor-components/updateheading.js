import React, { Component } from "react";
import styles from "./updateheading.css";

export default class UpdateHeading extends Component {
  constructor(props) {
    super(props);

    this.state = { active: true };
  }

  handleClick = () => {
    this.setState({ active: !this.state.active });
  }

  render() {
    return (
      <div
        onClick={this.handleClick}
        className={
          `${styles.updateHeading}
           ${(this.state.active ? styles.active : "")}`
        }
      >
        Update Heading 1 Style
      </div>
    );
  }
}
