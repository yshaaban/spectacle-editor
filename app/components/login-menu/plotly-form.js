import React, { Component, PropTypes } from "react";
import { ipcRenderer } from "electron";

import { login } from "../../api/user";
import SocialAuthLinks from "./social-auth-links";
import styles from "./plotly-form.css";

const domainUrl = "https://api.plot.ly";

class PlotlyForm extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      errorMessage: null
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
      this.setState({
        errorMessage: "Please enter a valid username"
      });

      return;
    }

    if (!password) {
      this.setState({
        errorMessage: "Please enter a valid password"
      });

      return;
    }

    login(domainUrl, username, password)
      .then(this.onLoginSuccess)
      .catch((errorMessage) => {
        this.setState({ errorMessage });
      });
  }

  onLoginSuccess = (userInfo) => {
    this.context.store.api.resetDomainUrl();
    this.context.store.api.setUser(userInfo);
    this.closeModal();
    this.setState({ errorMessage: null });
  }

  onSocialLoginError = (provider) => {
    this.setState({
      errorMessage: `${provider} login failed, please try again`
    });
  }

  onClickForgotPassword = (ev) => {
    ev.preventDefault();

    ipcRenderer.send("open-external", "https://plot.ly/accounts/password/reset/");
  }

  onClickCreateAccount = (ev) => {
    ev.preventDefault();

    ipcRenderer.send("open-external", "https://plot.ly");
  }

  closeModal = () => {
    this.props.onClose();
    this.setState({ errorMessage: null });
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className={styles.loginForm}
      >
        {this.state.errorMessage &&
          <h4 className={styles.errorMessage}>
            {this.state.errorMessage}
          </h4>
        }
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
        <a href="https://plot.ly/accounts/password/reset/" onClick={this.onClickForgotPassword}>
          Forgot password?
        </a>
        <SocialAuthLinks
          domain={"https://plot.ly/login"}
          apiUrl={domainUrl}
          onLoginSuccess={this.onLoginSuccess}
          onLoginError={this.onSocialLoginError}
        />
        <div className={styles.signUp}>
          <h3>Don't have a plot.ly account?</h3>
          <a href="http://plot.ly" onClick={this.onClickCreateAccount}>
            Create an account on plot.ly
          </a>
        </div>
      </form>
    );
  }
}

export default PlotlyForm;
