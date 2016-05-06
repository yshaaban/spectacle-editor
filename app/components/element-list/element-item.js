import React, { Component, PropTypes } from "react";

import DraggableElement from "../draggables/element";
import styles from "./element-item.css";

class ElementItem extends Component {
  render() {
    const { elementType } = this.props;

    return (
      <div>
        <div className={styles.item}>
          <DraggableElement elementType={elementType}>
            <img src="http://placehold.it/60x60" alt={elementType} />
            <h4>{elementType}</h4>
          </DraggableElement>
        </div>
      </div>
    );
  }
}

ElementItem.propTypes = {
  elementType: PropTypes.string.isRequired
};

export default ElementItem;
