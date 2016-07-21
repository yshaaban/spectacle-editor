import React, { Component, PropTypes } from "react";
import { ipcRenderer } from "electron";

import { login } from "../../api/user";
import { testApiUrl } from "../../api/on-premise";
import SocialAuthLinks from "./social-auth-links";
import spinner from "../../assets/images/spinner.svg";
import styles from "./on-premise-form.css";

class PlotlyForm extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      domain: "",
      validDomain: false,
      username: "",
      password: "",
      errorMessage: null,
      loadingDomain: false
    };
  }

  handleDomainChange = (ev) => {
    this.setState({ domain: ev.target.value });
  }

  handleUserChange = (ev) => {
    this.setState({ username: ev.target.value });
  }

  handlePasswordChange = (ev) => {
    this.setState({ password: ev.target.value });
  }

  handleDomainBlur = () => {
    if (!this.state.domain) {
      // TODO: Set error case
      return;
    }

    this.setState({ loadingDomain: true, validDomain: false });

    testApiUrl(this.state.domain)
      .then(() => {
        this.setState({ loadingDomain: false, validDomain: true });
      })
      .catch((err) => {
        this.setState({ loadingDomain: false });
      });
  }

  handleSubmit = (ev) => {
    ev.preventDefault();

    const { validDomain, username, password } = this.state;

    if (!validDomain) {
      this.setState({
        errorMessage: "Please enter a valid domain"
      });

      return;
    }

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

    login(this.state.domain, username, password)
      .then(this.onLoginSuccess)
      .catch((errorMessage) => {
        this.setState({ errorMessage });
      });
  }

  onLoginSuccess = (userInfo) => {
    this.context.store.api.setDomainUrl(this.state.domain);
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

    ipcRenderer.send("open-external", `${this.state.domain}/accounts/password/reset/`);
  }

  onClickCreateAccount = (ev) => {
    ev.preventDefault();

    ipcRenderer.send("open-external", this.state.domain);
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
        <label>Domain
          <input
            type="text"
            name="domain"
            value={this.state.domain}
            onChange={this.handleDomainChange}
            onBlur={this.handleDomainBlur}
          />
        </label>
        {this.state.loadingDomain &&
          <span dangerouslySetInnerHTML={{ __html: spinner }} />
        }
        {this.state.validDomain && <span>check</span>}
        <label>Username
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleUserChange}
          />
        </label>
        <label>Password
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </label>
        <button type="submit" disabled={!this.state.validDomain}>Sign in</button>
        <a
          href={`${this.state.domain}/accounts/password/reset/`}
          onClick={this.onClickForgotPassword}
        >
          Forgot password?
        </a>
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
