import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";
import { DropTarget } from "react-dnd";

import { DraggableTypes } from "../../constants";
import styles from "./slide.css";

const slideTarget = {
  drop(props, monitor, component) {
    const { elementType } = monitor.getItem();

    component.context.store.dropElement(elementType);
    console.log("DROPPIN YO", elementType);
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  hoverItem: monitor.getItem()
});

@observer
class Slide extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  render() {
    const { connectDropTarget, isOver, hoverItem } = this.props;
    const { store } = this.context;

    const slideClass = isOver ?
      `${styles.slide} ${styles.isOver}` :
      styles.slide;

    return connectDropTarget(
      <div className={slideClass}>
        <div>{`Slide with ${store.tree && store.tree.component}`}</div>
        <div>{isOver && hoverItem && `${hoverItem.elementType} BOUTS TO DROP`}</div>
      </div>
    );
  }
}

Slide.propTypes = {
  hoverItem: PropTypes.object,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default DropTarget( // eslint-disable-line new-cap
  DraggableTypes.UI_ELEMENT,
  slideTarget,
  collect
)(Slide);
