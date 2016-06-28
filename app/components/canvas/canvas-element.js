import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";
import { Motion, spring } from "react-motion";
import { omit, defer } from "lodash";

import { ElementTypes, SpringSettings, BLACKLIST_CURRENT_ELEMENT_DESELECT } from "../../constants";
import { getElementDimensions, getPointsToSnap, snap } from "../../utils";
import styles from "./canvas-element.css";
import ResizeNode from "./resize-node";
import { TextElement, ImageElement } from "./element-types"

@observer
class CanvasElement extends Component {
  static propTypes = {
    component: PropTypes.object
  };

  getElementType(type) {
    if (type === ElementTypes.TEXT) {
      return <TextElement />;
    }

    if (type === ElementTypes.IMAGE) {
      return <ImageElement />;
    }
  }

  render() {
    const { component } = this.props;

    return React.cloneElement(
      this.getElementType(component.type),
      { ...this.props }
    );
  }
}

export default CanvasElement;
