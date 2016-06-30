import React, { Component, PropTypes } from "react";

import styles from "./user-menu.css";

class UserMenu extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;

    return (
      <div className={styles.userMenu}>
        <img alt="avatar" src={user.avatar_url} />
        <div className={styles.userSubMenu}>
          <h4>{user.username}</h4>
          <div className={styles.signOut}>Sign out</div>
        </div>
      </div>
    );
  }
}

export default UserMenu;
