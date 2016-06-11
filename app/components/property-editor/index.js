import React, { Component } from "react";
import { observer } from "mobx-react";
import { autorun } from "mobx";

import styles from "./index.css";
import SlideMenu from "./contextual-menus/slides";
import TextMenu from "./contextual-menus/text";
import ImageMenu from "./contextual-menus/image";
import { ElementTypes } from "../../constants";

@observer
class PropertyEditor extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      hasMenu: false,
      contextualMenu: null
    };
  }

  componentDidMount() {
    autorun(() => {
      if (this.context.store.currentElement) {
        this.setState({
          hasMenu: true,
          contextualMenu: this.context.store.currentElement.type
        });
        return;
      }

      this.setState({ hasMenu: false, contextualMenu: null });
    });
  }

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
    const moveMenu = this.state.hasMenu ? styles.slidesInactive : "";
    const { contextualMenu } = this.state;

    return (
      <div className={styles.editor}>
        <div className={`${styles.menu} ${moveMenu}`}>
          <SlideMenu />
        </div>
        <div className={`${styles.menu} ${styles.contextMenu}
           ${(ElementTypes.TEXT === contextualMenu) ?
          styles.contextMenuActive : ""}`}
        >
          <TextMenu />
        </div>
        <div className={`${styles.menu} ${styles.contextMenu}
           ${(ElementTypes.IMAGE === contextualMenu) ?
          styles.contextMenuActive : ""}`}
        >
          <ImageMenu />
        </div>
      </div>
    );
  }
}

export default PropertyEditor;
