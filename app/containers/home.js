import React, { Component, PropTypes } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import SlidesStore from "../stores/slides-store";
import Provider from "../components/utils/provider";
import HistoryMenu from "../components/history-menu";
import PropertyEditor from "../components/property-editor";
import ElementList from "../components/element-list";
import SlideList from "../components/slide-list";
import Canvas from "../components/canvas";
import defaultTheme from "../themes/default";
import styles from "./home.css";

const store = new SlidesStore();

class Home extends Component {
  // MOCKED FOR NOW
  // TODO: Remove when theming and styling is solved
  static childContextTypes = {
    styles: PropTypes.object
  };

  // MOCKED FOR NOW
  // TODO: Remove when theming and styling is solved
  getChildContext() {
    return {
      styles: defaultTheme()
    };
  }

  render() {
    return (
      <Provider store={store}>
        <div className={styles.home}>
          <ElementList />
          <HistoryMenu />
          <div className={styles.container}>
            <SlideList />
            <PropertyEditor />
            <Canvas />
          </div>
        </div>
      </Provider>
    );
  }
}

export default DragDropContext(HTML5Backend)(Home); // eslint-disable-line new-cap
