import React, { Component } from "react";
import { observer } from "mobx-react";

import { create } from "../../api/presentation";
import { getCurrentUser } from "../../api/user";

import styles from "./index.css";

@observer
class UploadButton extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  onClickUpload = () => {
    const presJSON = this.context.store.serialize();
    const { domainUrl, csrfToken } = this.context.store.api;

    getCurrentUser(domainUrl).then(res => { console.log(res)});
    create(domainUrl, csrfToken, presJSON);
    // TODO: Add `visible` class
    console.log(this.refs.flyoutUpload);
  }

  render() {
    const { user } = this.context.store.api;

    return (
      <div className={styles.upload}>
        <button className={styles.uploadBtn} onClick={this.onClickUpload} disabled={!user} >
          <i className={`ionicons ion-ios-cloud-upload-outline ${styles.uploadIcon}`}></i>
          Upload
        </button>
        <div ref="flyoutUpload" className={styles.flyout}>
          <p className={styles.flyoutHeading}>Upload presentation to plot.ly</p>
          <form>
            <label className={styles.flyoutLabel}>
              Name
              <input type="text" className={styles.flyoutInput} />
            </label>
            <p className={styles.flyoutRadioHeading}>Privacy Settings</p>
            <label className={styles.flyoutRadio}>
              <input type="radio" name="uploadPrivacySettings" value="public" />
              Public
            </label>
            <label className={styles.flyoutRadio}>
              <input type="radio" name="uploadPrivacySettings" value="private_link" />
              Private Link
            </label>
            <label className={styles.flyoutRadio}>
              <input type="radio" name="uploadPrivacySettings" value="private" />
               Private
            </label>
            <button className={styles.flyoutBtnPublish}>
              Publish
            </button>
            <button className={styles.flyoutClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default UploadButton;
