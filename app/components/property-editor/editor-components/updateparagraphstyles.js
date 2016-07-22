import React, { Component } from "react";
import styles from "./updateparagraphstyles.css";

export default class UpdateParagraphStyles extends Component {
  static propTypes = {
    currentParagraphStyle: React.PropTypes.string
  }

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
        Update {this.props.currentParagraphStyle} Style
      </div>
    );
  }
}
