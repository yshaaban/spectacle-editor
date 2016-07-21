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
    const imageObj = ev.target.files && ev.target.files[0];

    console.log(imageObj);
    if (imageObj) {
      const { path, type, name } = imageObj;

      ipcRenderer.once("image-encoded", (event, encodedImageString) => {
        if (!encodedImageString) {
          this.setState({ uploadError: true });
        }

        this.context.store.updateElementProps({
          src: `data:${type};base64, ${encodedImageString}`,
          imageName: name
        });
      });

      ipcRenderer.send("encode-image", path);
    }
  }

  onSourceChange = (ev) => {
    const imageSrc = ev.target.value;

    if (imageSrc) {
      console.log(imageSrc);
      this.context.store.updateElementProps({
        src: imageSrc,
        imageName: null
      });
    }
  }


  render() {
    return (
      <div className={commonStyles.wrapper}>
        <h3 className={commonStyles.heading}>Image</h3>
        <label className={styles.imageSource}>
          Image source
          <input
            className={styles.imageSourceInput}
            type="text"
            name="imagesSource"
            onChange={this.onSourceChange}
          />
        </label>
        <label className={styles.fileUploadLabel}>
          Choose a file to upload
          <input
            className={styles.fileUploadInput}
            type="file"
            name="imageFile"
            accept="image/x-png, image/gif, image/jpeg"
            onChange={this.onImageUpload}
          />
        </label>
        {this.state.image && <img src={this.state.image} /> }
      </div>
    );
  }
}
