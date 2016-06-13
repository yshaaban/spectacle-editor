import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";

import SlidesStore from "../stores/slides-store";
import Provider from "../components/utils/provider";
import HistoryMenu from "../components/history-menu";
import PropertyEditor from "../components/property-editor";
import MenuBar from "../components/menu-bar";
import SlideList from "../components/slide-list";
import Canvas from "../components/canvas";
import defaultTheme from "../themes/default";
import styles from "./home.css";
import { BLACKLIST_CURRENT_ELEMENT_DESELECT } from "../constants";

const store = new SlidesStore();

@observer
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

  componentDidMount() {
    document.addEventListener("mousedown", (ev) => {
      const findClassRecursively = (el) => {
        const classes = el.classList ? Array.prototype.slice.call(el.classList) : [];
        const isClass = classes.indexOf(BLACKLIST_CURRENT_ELEMENT_DESELECT) > -1;
        if (isClass) {
          return true;
        }
        if (!el.parentNode) {
          return false;
        }
        return findClassRecursively(el.parentNode);
      };

      if (!findClassRecursively(ev.target)) {
        store.setCurrentElementIndex(null);
      }
    });
  }


  render() {
    const wrapperStyles = {};

    if (store.isDragging) {
      wrapperStyles.cursor = "-webkit-grabbing";
      wrapperStyles.pointerEvents = "none";
    }

    return (
      <Provider store={store}>
        <div className={styles.home} style={wrapperStyles}>
          <MenuBar />
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

export default Home;
