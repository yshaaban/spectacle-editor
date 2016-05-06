import React, { Component } from "react";

import ElementItem from "./element-item";
import styles from "./index.css";
import { ElementTypes } from "../../constants";

class ElementList extends Component {
  render() {
    return (
      <div className={styles.list}>
        <ElementItem elementType={ElementTypes.HEADING} />
        <ElementItem elementType={ElementTypes.TEXT} />
        <ElementItem elementType={ElementTypes.LIST} />
        <ElementItem elementType={ElementTypes.LINK} />
        <ElementItem elementType={ElementTypes.IMAGE} />
        <ElementItem elementType={ElementTypes.PLOTLY} />
        <ElementItem elementType={ElementTypes.CODE} />
        <ElementItem elementType={ElementTypes.QUOTE} />
      </div>
    );
  }
}

export default ElementList;
