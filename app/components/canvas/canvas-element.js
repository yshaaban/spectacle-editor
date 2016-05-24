import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";

import { ElementTypes } from "../../constants";
import styles from "./canvas-element.css";

@observer
class CanvasElement extends Component {
  static propTypes = {
    elementIndex: PropTypes.number,
    component: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object
  };

  onClick = (ev) => {
    ev.preventDefault();

    this.context.store.setCurrentElementIndex(this.props.elementIndex);
  }

  render() {
    const { elementIndex, component: { type, ComponentClass, props, children } } = this.props;

    const selected = elementIndex === this.context.store.currentElementIndex;
    const extraClasses = selected ? ` ${styles.selected}` : "";

    const wrapperStyle = {};
    let elementStyle = props.style ? { ...props.style } : {};

    if (props.style && props.style.position === "absolute") {
      wrapperStyle.position = "absolute";
      wrapperStyle.left = props.style.left;
      wrapperStyle.top = props.style.top;

      elementStyle = { ...elementStyle, position: "relative", left: 0, top: 0 };
    }

    return (
      <div
        className={styles.canvasElement + extraClasses}
        style={wrapperStyle}
        onClick={this.onClick}
      >
        {type !== ElementTypes.IMAGE ?
          <ComponentClass {...props} style={elementStyle}>{children}</ComponentClass> :
          <ComponentClass {...props} style={elementStyle} />
        }
      </div>
    );
  }
}

export default CanvasElement;
