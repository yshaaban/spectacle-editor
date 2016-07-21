import React, { Component, PropTypes } from "react";

import PlotlyForm from "./plotly-form";
import OnPremiseForm from "./on-premise-form";
import styles from "./login-modal.css";
import commonStyles from "./index.css";

class LoginMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onPremiseActive: false
    };
  }

  onClickTab(onPremiseActive) {
    this.setState({ onPremiseActive });
  }

  closeModal = () => {
    this.props.onClose();
  }

  render() {
    const { onPremiseActive } = this.state;

    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginModalBackground} onClick={this.closeModal}></div>
        <div className={styles.loginMenu}>
          <header className={styles.loginMenuHeader}>
            <div className={styles.loginCloseButton} onClick={this.closeModal}>
              <i className={"icon ion-android-close"}></i>
            </div>
            <h1 className={styles.modalHeading}>
              Sign in
            </h1>
            <div className={styles.loginTabs}>
              <button onClick={this.onClickTab.bind(this, false)}>Plot.ly</button>
              <button onClick={this.onClickTab.bind(this, true)}>On Premise</button>
            </div>
          </header>
          <main>
            <div className={`${styles.panel} ${!onPremiseActive && styles.visible}`}>
              <PlotlyForm onClose={this.props.onClose} />
            </div>

            <div className={`${styles.panel} ${onPremiseActive && styles.visible}`}>
              <OnPremiseForm onClose={this.props.onClose} />
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default LoginMenu;
