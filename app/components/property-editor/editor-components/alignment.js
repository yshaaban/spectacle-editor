import React, { Component } from "react";
import { ALIGNLEFT, ALIGNCENTER, ALIGNRIGHT } from "../../../assets/icons";
import styles from "./alignment.css";

export default class Alignment extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  handleAlignmentChange = (updatedProp) => () => {
    const { style } = this.context.store.currentElement.props;
    const updatedStyles = { ...style, textAlign: updatedProp };

    this.context.store.updateElementProps({ style: updatedStyles });
  }

  render() {
    const { currentElement } = this.context.store;
    const currentAlignment = currentElement.props.style.textAlign;

    return (
      <div className={styles.alignmentWrapper}>
        <span
          onClick={this.handleAlignmentChange("left")}
          className={`${styles.alignmentBox}
           ${currentAlignment === "left" ? styles.selectedAlignment : ""}`}
          dangerouslySetInnerHTML={{ __html: ALIGNLEFT }}
        ></span>
        <span
          onClick={this.handleAlignmentChange("center")}
          className={`${styles.alignmentBox}
           ${currentAlignment === "center" ? styles.selectedAlignment : ""}`}
          dangerouslySetInnerHTML={{ __html: ALIGNCENTER }}
        ></span>
        <span
          onClick={this.handleAlignmentChange("right")}
          className={`${styles.alignmentBox}
           ${currentAlignment === "right" ? styles.selectedAlignment : ""}`}
          dangerouslySetInnerHTML={{ __html: ALIGNRIGHT }}
        ></span>
      </div>
    );
  }
}
