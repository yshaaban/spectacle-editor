import React, { Component } from "react";
import { observer } from "mobx-react";

import propertyMap from "./property-menu-map"
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
      const styleKeys = Object.keys(props.style);
      const properties = propertyMap[currentElement.type]

      content = (<div>
        <h2>{currentElement.type}</h2>
        <ul>
          {styleKeys.map((propName) => {
            var prop = properties[propName]
            if (!prop) return;
            let inputElement;

            if (prop.type === "number") {
              inputElement = (<input
                type="number"
                value={prop.default}
                onChange={(e) => this.onStyleChange(e, propName)}
              />);
            } else if (prop.type === "color") {
              // TODO: replace with color picker
              inputElement = (<input
                type="text" 
                value={style[propName]}
                onChange={(e) => this.onStyleChange(e, propName)}
              />);
            }

            return (<li key={`${props.id}-${propName}`}>
              <h4>{propName}</h4>
              {inputElement}
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
