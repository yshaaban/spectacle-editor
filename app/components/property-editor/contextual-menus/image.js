import React, { Component } from "react";
import { ipcRenderer } from "electron";

import commonStyles from "../index.css";
import styles from "./image.css";


export default class ImageMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      image: null
    };
  }

  onImageUpload = (ev) => {
    const imagePath = ev.target.files && ev.target.files[0] && ev.target.files[0].path;

    console.log(ev.target.files[0])
    if (imagePath) {
      const imageType = ev.target.files[0].type;

      ipcRenderer.once("image-encoded", (event, encodedImageString) => {
        if (!encodedImageString) {
          this.setState({ uploadError: true });
        }

        console.log(encodedImageString);

        this.context.store.updateElementProps({
          src: `data:${imageType};base64, ${encodedImageString}`
        });
      });

      ipcRenderer.send("encode-image", imagePath);
    }
  }

  render() {
    return (
      <div className={commonStyles.wrapper}>
        <h3 className={commonStyles.heading}>Image</h3>
        <label className={styles.fileUploadLabel}>
          Choose a file to upload
          <input
            className={styles.fileUploadInput}
            type="file"
            name="myImage"
            accept="image/x-png, image/gif, image/jpeg"
            onChange={this.onImageUpload}
          />
        </label>
        {this.state.image && <img src={this.state.image} /> }
      </div>
    );
  }
}
