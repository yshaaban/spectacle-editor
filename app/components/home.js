import React, { Component } from "react";
import { observer } from "mobx-react";
import styles from "./home.css";

class Home extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  render() {
    setTimeout(() => {
      this.context.store.tree.component = "NNNNEEEEEW STAAAAAAATE";
    }, 2000);

    return (
      <div>
        <div className={styles.container}>
          <h2>App</h2>
          <h3>Store data {this.context.store.tree.component}</h3>
        </div>
      </div>
    );
  }
}

export default observer(Home);
