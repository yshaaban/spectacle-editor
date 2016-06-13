import React, { Component } from "react";
import { ALIGNLEFT, ALIGNCENTER, ALIGNRIGHT } from "../../../assets/icons";
import styles from "./index.css";

export default class Alignment extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.handleAlignmentChange = this.handleAlignmentChange.bind(this);
  }

  handleAlignmentChange(updatedProp) {
    return () => {
      const { style } = this.context.store.currentElement.props;
      const updatedStyles = Object.assign({}, style, { textAlign: updatedProp });
      this.context.store.updateElementProps({ style: updatedStyles });
    };
  }

  render() {
    const { currentElement } = this.context.store;
    const currentAlignment = currentElement.props.style.textAlign;

    return (
      <div className={styles.alignmentWrapper}>
        <span
          onClick={this.handleAlignmentChange("left")}
          className={currentAlignment === "left" ? styles.selectedAlignment : ""}
          dangerouslySetInnerHTML={{ __html: ALIGNLEFT }}
        ></span>
        <span
          onClick={this.handleAlignmentChange("center")}
          className={currentAlignment === "center" ? styles.selectedAlignment : ""}
          dangerouslySetInnerHTML={{ __html: ALIGNCENTER }}
        ></span>
        <span
          onClick={this.handleAlignmentChange("right")}
          className={currentAlignment === "right" ? styles.selectedAlignment : ""}
          dangerouslySetInnerHTML={{ __html: ALIGNRIGHT }}
        ></span>
      </div>
    );
  }
}
