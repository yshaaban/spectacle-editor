import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";

import styles from "./index.css";

@observer
class HistoryMenu extends Component {
  static contextTypes = {
    store: PropTypes.object
  };

  onClickUndo = () => {
    this.context.store.undo();
  }

  onClickRedo = () => {
    this.context.store.redo();
  }

  render() {
    const { undoDisabled, redoDisabled } = this.context.store;

    return (
      <div className={styles.historyMenu}>
        <button onClick={this.onClickUndo} disabled={undoDisabled}>Undo</button>
        <button onClick={this.onClickRedo} disabled={redoDisabled}>Redo</button>
      </div>
    );
  }
}

export default HistoryMenu;
