import React, { Component, PropTypes } from "react";
import { DragSource } from "react-dnd";

import { DraggableTypes } from "../../constants";
import styles from "./element.css";

const DraggableElementSource = {
  beginDrag(props) {
    return {
      elementType: props.elementType
    };
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

class DraggableElement extends Component {
  render() {
    const { connectDragSource, isDragging } = this.props;

    const elementClass = isDragging ?
      `${styles.element} ${styles.isDragging}` :
      styles.element;

    return connectDragSource(
      <div className={elementClass}>
        {this.props.children}
      </div>
    );
  }
}

DraggableElement.propTypes = {
  elementType: PropTypes.string.isRequired,
  children: PropTypes.any,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource( // eslint-disable-line new-cap
  DraggableTypes.UI_ELEMENT,
  DraggableElementSource,
  collect
)(DraggableElement);
