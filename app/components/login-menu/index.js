import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";

import LoginModal from "./login-modal";
import UserMenu from "./user-menu";
import styles from "./index.css";

@observer
class LoginMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      loginModalVisible: false
    };
  }

  onClickLogin = () => {
    this.setState({ loginModalVisible: true });
  }

  onCloseModal = () => {
    this.setState({ loginModalVisible: false });
  }

  render() {
    const { user } = this.context.store;
    const { loginModalVisible } = this.state;

    return (
      <div>
        {user ? <UserMenu user={user} /> :
          <div className={styles.loginButton} onClick={this.onClickLogin}>
            <i className={"icon ion-person"}></i>
            <h4>Sign in to Plot.ly</h4>
          </div>
        }
        {!user && loginModalVisible && <LoginModal onClose={this.onCloseModal} />}
      </div>
    );
  }
}

export default LoginMenu;
