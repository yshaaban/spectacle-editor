import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";
import { Motion, spring } from "react-motion";

import { ElementTypes, SpringSettings } from "../../constants";
import styles from "./canvas-element.css";

@observer
class CanvasElement extends Component {
  static propTypes = {
    elementIndex: PropTypes.number,
    component: PropTypes.shape({
      type: PropTypes.oneOf(Object.keys(ElementTypes).map(key => ElementTypes[key])).isRequired,
      ComponentClass: React.PropTypes.any.isRequired,
      props: PropTypes.object,
      children: PropTypes.node
    }).isRequired,
    selected: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object
  };

  onClick = (ev) => {
    ev.preventDefault();

    this.context.store.setCurrentElementIndex(this.props.elementIndex);
  }

  render() {
    const {
      elementIndex,
      selected,
      component: { type, width, height, ComponentClass, props, children },
      mousePosition,
      scale
    } = this.props;

    const currentlySelected = selected || elementIndex === this.context.store.currentElementIndex;
    const extraClasses = currentlySelected ? ` ${styles.selected}` : "";

    const wrapperStyle = {};
    const motionStyles = {};
    let elementStyle = props.style ? { ...props.style } : {};

    if (this.context.store.isDragging) {
      wrapperStyle.pointerEvents = "none";
    }

    if (mousePosition || props.style && props.style.position === "absolute") {
      wrapperStyle.position = "absolute";

      motionStyles.left = spring(
        // TODO: Grab rendered width and height
        mousePosition ? mousePosition[0] - (width / 2) : props.style.left,
        SpringSettings.DRAG
      );

      motionStyles.top = spring(
        // TODO: Grab rendered width and height
        mousePosition ? mousePosition[1] - (height / 2) : props.style.top,
        SpringSettings.DRAG
      );

      if (mousePosition) {
        wrapperStyle.whiteSpace = "nowrap";
      }

      if (scale) {
        wrapperStyle.transform = `scale(${scale})`;
      }

      elementStyle = { ...elementStyle, position: "relative", left: 0, top: 0 };
    }

    return (
        <Motion
          style={motionStyles}
        >
          {computedStyles => (
            <div
              className={styles.canvasElement + extraClasses}
              style={{ ...wrapperStyle, ...computedStyles }}
              onClick={this.onClick}
            >
              {type !== ElementTypes.IMAGE ?
                <ComponentClass {...props} style={elementStyle}>{children}</ComponentClass> :
                <ComponentClass {...props} style={elementStyle} />
              }
            </div>
          )}
        </Motion>
    );
  }
}

export default CanvasElement;
