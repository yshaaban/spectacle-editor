import React, { Component } from "react";
import { observer } from "mobx-react";

import styles from "./index.css";

@observer
class PropertyEditor extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  onPropertyChange = (e, key) => {
    let value = e.target.value;

    if (key === "size") {
      value = parseInt(value, 10);
    }

    this.context.store.updateElementProps({ size: value });
  }

  onStyleChange = (e, key) => {
    const style = {};
    style[key] = e.target.value;
    this.context.store.updateElementProps({ style });
  }

  render() {
    const { currentElement } = this.context.store;
    let content;

    if (currentElement) {
      const props = currentElement.props;
      const propertyKeys = Object.keys(props);
      const style = props.style;
      const styleKeys = Object.keys(style);

      // TODO: which properties should actually be exposed to the user, and where is that defined
      // TODO: where should the ui elements for each type be defined
      content = (<div>
        <h2>{currentElement.type}</h2>
        <ul>
          {propertyKeys.map((key) => {
            if (key === "style") return false;
            return (<li key={`${props.id}-${key}`}>
              <h4>{key}</h4>
              <input
                type="number"
                value={props[key]}
                onChange={(e) => this.onPropertyChange(e, key)}
              />
            </li>);
          })}
          {styleKeys.map((key) => {
            if (key === "style") return false;
            return (<li key={`${props.id}-${key}`}>
              <h4>{key}</h4>
              <input
                type="text"
                value={style[key]}
                onChange={(e) => this.onStyleChange(e, key)}
              />
            </li>);
          })}
        </ul>
      </div>);
    }

    return (
      <div className={styles.editor}>
        {content}
      </div>
    );
  }
}

export default PropertyEditor;
