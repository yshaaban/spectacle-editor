import React, { Component, PropTypes } from "react";
import { DropTarget } from "react-dnd";

import styles from "./index.css";

class HistoryMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  onClickUndo = () => {
    this.context.store.undo();
  }

  onClickRedo = () => {
    this.context.store.redo();
  }

  render() {
    return (
      <div className={styles.historyMenu}>
        <button onClick={this.onClickUndo}>Undo</button>
        <button onClick={this.onClickRedo}>Redo</button>
      </div>
    );
  }
}

HistoryMenu.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default HistoryMenu;
