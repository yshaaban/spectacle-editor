import React, { Component } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { observer } from "mobx-react";

import HistoryMenu from "./history-menu";
import PropertyEditor from "./property-editor";
import ElementList from "./element-list";
import SlideList from "./slide-list";
import Canvas from "./canvas";
import styles from "./home.css";

class Home extends Component {
  render() {
    return (
      <div className={styles.home}>
        <ElementList />
        <HistoryMenu />
        <div className={styles.container}>
          <SlideList />
          <PropertyEditor />
          <Canvas />
        </div>
      </div>
    );
  }
}

export default observer(DragDropContext(HTML5Backend)(Home)); // eslint-disable-line new-cap
