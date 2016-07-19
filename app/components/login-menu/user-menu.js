import React, { Component, PropTypes } from "react";

import styles from "./user-menu.css";

class UserMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    domain: PropTypes.string.isRequired
  };

  onClickSignOut = (ev) => {
    ev.preventDefault();

    fetch(`${this.context.store.api.domainUrl}/signout/`)
      .then(() => {
        this.context.store.api.signOut();
      });
  }

  render() {
    const { user } = this.props;

    return (
      <div className={styles.userMenu}>
        <img alt="avatar" src={user.avatar_url} />
        <div className={styles.userSubMenu}>
          <h4>{user.username}</h4>
          <div className={styles.signOut} onClick={this.onClickSignOut}>Sign out</div>
        </div>
      </div>
    );
  }
}

export default UserMenu;
