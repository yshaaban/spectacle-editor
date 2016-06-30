import React, { Component, PropTypes } from "react";

import SocialAuthLinks from "./social-auth-links";
import plotlyBrandingBg from "../../assets/images/plotly-branding-bg.png";
import styles from "./login-modal.css";

class LoginMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  handleUserChange = (ev) => {
    this.setState({ username: ev.target.value });
  }

  handlePasswordChange = (ev) => {
    this.setState({ password: ev.target.value });
  }

  handleSubmit = (ev) => {
    ev.preventDefault();

    const { username, password } = this.state;

    if (!username) {
      // TODO: Validation around username
      return;
    }

    if (!password) {
      // TODO: validation around password
      return;
    }

    fetch(`https://api.plot.ly/v2/users/login`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Plotly-Client-Platform": "Python 0.2"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    .then((res) => {console.log(res); return res.json();})
    .then(this.onLoginSuccess);
  }

  onLoginSuccess = (userInfo) => {
    console.log(userInfo);
    this.context.store.setUser(userInfo);
    this.closeModal();
  }

  closeModal = () => {
    this.props.onClose();
  }

  render() {
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginModalBackground} onClick={this.closeModal}></div>
        <div className={styles.loginMenu}>
          <div
            className={styles.loginBrandingBackground}
            style={{
              backgroundImage: `url(${plotlyBrandingBg})`
            }}
          >
          </div>
          <form
            onSubmit={this.handleSubmit}
            className={styles.loginForm}
          >
            <h2>Sign in</h2>
            <label>plot.ly username
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleUserChange}
              />
            </label>
            <label>plot.ly password
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </label>
            <button type="submit">Sign in</button>
            <a href="https://plot.ly/accounts/password/reset/">Forgot password?</a>
            <SocialAuthLinks onLoginSuccess={this.onLoginSuccess} />
            <div className={styles.signUp}>
              <h3>Don't have a plot.ly account?</h3>
              {/* // TODO: make this open a new browser window */}
              <a href="http://plot.ly">Create an account on plot.ly</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginMenu;
