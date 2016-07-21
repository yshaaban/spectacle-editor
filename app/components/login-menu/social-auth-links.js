import React, { Component, PropTypes } from "react";
import { ipcRenderer } from "electron";

import { FACEBOOK, GITHUB, GOOGLEPLUS, TWITTER } from "../../assets/icons";
import styles from "./social-auth-links.css";

import { getCurrentUser } from "../../api/user";

const socialAuthProviders = {
  Facebook: "/facebook/",
  Twitter: "/twitter/",
  GitHub: "/github/",
  Google: "/google-oauth2/"
};

class SocialAuthenticationLinks extends Component {
  static propTypes = {
    apiUrl: PropTypes.string,
    onLoginSuccess: PropTypes.func,
    onLoginError: PropTypes.func,
    domain: PropTypes.string
  };

  authenticate(provider) {
    ipcRenderer.once("social-login", () => {
      getCurrentUser(this.props.apiUrl)
        .then((user) => {
          if (!user || !user.username) {
            throw new Error("no user found");
          }

          this.props.onLoginSuccess(user);
        })
        .catch(() => {
          this.props.onLoginError(provider);
        });
    });

    ipcRenderer.send("social-login", `${this.props.domain}${socialAuthProviders[provider]}`);
  }

  render() {
    return (
      <div className={styles.socialAuthLinks}>
        <p className={styles.socialAuthHeading}>
          <span className={styles.fancy}>Sign in with</span>
        </p>
        <div className={styles.socialAuthButtonGroup}>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "Twitter")}
            className={styles.socialAuthButton}
          >
            <i
              className={styles.socialAuthIcon}
              dangerouslySetInnerHTML={{ __html: TWITTER }}
            />
            Sign in with Twitter
          </button>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "Facebook")}
            className={styles.socialAuthButton}
          >
            <i
              className={styles.socialAuthIcon}
              dangerouslySetInnerHTML={{ __html: FACEBOOK }}
            />
            Sign in with Facebook
          </button>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "GitHub")}
            className={styles.socialAuthButton}
          >
            <i
              className={styles.socialAuthIcon}
              dangerouslySetInnerHTML={{ __html: GITHUB }}
            />
            Sign in with GitHub
          </button>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "Google")}
            className={styles.socialAuthButton}
          >
            <i
              className={styles.socialAuthIcon}
              style={{
                marginLeft: "5px",
                marginRight: "-5px"
              }}
              dangerouslySetInnerHTML={{ __html: GOOGLEPLUS }}
            />
            Sign in with Google Plus
          </button>
        </div>
      </div>
    );
  }
}

export default SocialAuthenticationLinks;
