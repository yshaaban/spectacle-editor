import React, { Component } from "react";
import { autorun } from "mobx";

import { ElementTypes } from "../../constants";
import styles from "./index.css";

class PropertyEditor extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  componentDidMount() {
    autorun(() => {
      const currentElement = this.context.store.currentElement

      this.setState({
        currentElement
      })
    });
  }

  onPropertyChange = (e, key) => {
    let value = e.target.value;

    if (key === 'size') {
      value = parseInt(value);
    }

    this.context.store.updateElementProps({ size: value });
  }

  onStyleChange = (e, key) => {
    const style = {};
    style[key] = e.target.value
    this.context.store.updateElementProps({ style });
  }

  render() {
    const element = this.state.currentElement;
    let content;

    if (element) {
      const props = element.props;
      const propertyKeys = Object.keys(props);
      const style = props.style;
      const styleKeys = Object.keys(style);

      content = <div>
        <h2>{element.type}</h2>
        <ul>
          {propertyKeys.map((key) => {
            if (key === 'style') return false;
            return <li key={`${props.id}-${key}`}>
              <h4>{key}</h4>
              <input type="number" value={props[key]} onChange={(e) => this.onPropertyChange(e, key)} />
            </li>
          })}
          {styleKeys.map((key) => {
            if (key === 'style') return false;
            return <li key={`${props.id}-${key}`}>
              <h4>{key}</h4>
              <input type="text" value={style[key]} onChange={(e) => this.onStyleChange(e, key)} />
            </li>
          })}
        </ul>
      </div>
    }

    return (
      <div className={styles.editor}>
        {content}
      </div>
    );
  }
}

export default PropertyEditor;
