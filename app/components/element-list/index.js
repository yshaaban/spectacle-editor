import React, { Component } from "react";

import ElementItem from "./element-item";
import styles from "./index.css";
import { ElementTypes } from "../../constants";

class ElementList extends Component {
  render() {
    return (
      <div className={styles.list}>
        <ElementItem elementType={ElementTypes.TEXT} {...this.props} />
        <ElementItem elementType={ElementTypes.IMAGE} {...this.props} />
        <ElementItem elementType={ElementTypes.PLOTLY} {...this.props} />
      </div>
    );
  }
}

export default ElementList;
