import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";

import { ElementTypes } from "../../constants";
import styles from "./canvas-element.css";

@observer
class CanvasElement extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  onClick = (ev) => {
    ev.preventDefault();

    this.context.store.setCurrentElementIndex(this.props.elementIndex);
  }

  render() {
    const { elementIndex, component: { type, ComponentClass, props, children } } = this.props;

    const selected = elementIndex === this.context.store.currentElementIndex;

    const extraClasses = selected ? ` ${styles.selected}` : "";

    return (
      <div className={styles.canvasElement + extraClasses} onClick={this.onClick}>
        {type !== ElementTypes.IMAGE ?
          <ComponentClass {...props}>{children}</ComponentClass> :
          <ComponentClass {...props} />
        }
      </div>
    );
  }
}

export default CanvasElement;
