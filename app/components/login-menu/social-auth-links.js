import React, { Component, PropTypes } from "react";
import { ipcRenderer } from "electron";
import { find } from "lodash";

import socialLinkSprite from "../../assets/images/social-link-sprite.png";
import styles from "./social-auth-links.css";

import { getCurrentUser } from "../../api/user";

const socialAuthProviders = {
  Facebook: "/facebook/",
  Twitter: "/twitter/",
  GitHub: "/github/",
  Google: "/google-oauth2/"
};

class SocialAuthenticationLinks extends Component {
  authenticate(provider, onSuccess, onError) {
    ipcRenderer.once("social-login", (event, cookies) => {
      const csrfToken = find(cookies, { name: "plotly_csrf_pr" }).value;

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
        <h3>Sign in with</h3>
        <div className={styles.socialAuthButtonGroup}>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "Facebook")}
            className={styles.socialAuthButton}
            style={{
              backgroundImage: `url(${socialLinkSprite})`
            }}
          ></button>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "Twitter")}
            className={styles.socialAuthButton}
            style={{
              backgroundImage: `url(${socialLinkSprite})`,
              backgroundPosition: "0 -24px"
            }}
          ></button>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "GitHub")}
            className={styles.socialAuthButton}
            style={{
              backgroundImage: `url(${socialLinkSprite})`,
              backgroundPosition: "0 -48px"
            }}
          ></button>
          <button
            type="button"
            onClick={this.authenticate.bind(this, "Google")}
            className={styles.socialAuthButton}
            style={{
              backgroundImage: `url(${socialLinkSprite})`,
              backgroundPosition: "0 -70px"
            }}
          ></button>
        </div>
      </div>
    );
  }
}

export default SocialAuthenticationLinks;
