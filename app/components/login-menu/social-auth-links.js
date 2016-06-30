import React, { Component, PropTypes } from "react";

import SocialAuthModal from "./social-auth-modal";
import socialLinkSprite from "../../assets/images/social-link-sprite.png";
import styles from "./social-auth-links.css";

class SocialAuthenticationLinks extends Component {
  handleSocialAuth(provider) {
    SocialAuthModal.authenticate(provider, (userInfo) => {
      this.props.onLoginSuccess(userInfo);
    });
  }

  render() {
    return (
      <div className={styles.socialAuthLinks}>
        <h3>Sign in with</h3>
        <div className={styles.socialAuthButtonGroup}>
          <button
            onClick={this.handleSocialAuth.bind(this, SocialAuthModal.Facebook)}
            className={styles.socialAuthButton}
            style={{
              backgroundImage: `url(${socialLinkSprite})`
            }}
          ></button>
          <button
            onClick={this.handleSocialAuth.bind(this, SocialAuthModal.Twitter)}
            className={styles.socialAuthButton}
            style={{
              backgroundImage: `url(${socialLinkSprite})`,
              backgroundPosition: "0 -24px"
            }}
          ></button>
          <button
            onClick={this.handleSocialAuth.bind(this, SocialAuthModal.GitHub)}
            className={styles.socialAuthButton}
            style={{
              backgroundImage: `url(${socialLinkSprite})`,
              backgroundPosition: "0 -48px"
            }}
          ></button>
          <button
            onClick={this.handleSocialAuth.bind(this, SocialAuthModal.Google)}
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
