import React, { Component } from "react";
import { ipcRenderer } from "electron";
import { autorun } from "mobx";

import { ElementTypes } from "../../../constants";
import commonStyles from "../index.css";
import styles from "./image.css";

const defaultImageSource = "http://placehold.it/400x200&text=sliding_yeah";

export default class ImageMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      currentElement: null
    };
  }

  componentDidMount() {
    autorun(() => {
      const { currentElement } = this.context.store;

      window.clearTimeout(this.stateTimeout);

      if (!currentElement) {
        this.stateTimeout = window.setTimeout(() => {
          this.setState({ currentElement });
        }, 400);

        return;
      }

      if (currentElement.type === ElementTypes.IMAGE) {
        this.setState({ currentElement });
      }
    });
  }

  onImageUpload = (ev) => {
    const imageObj = ev.target.files && ev.target.files[0];

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
      this.context.store.updateElementProps({
        src: imageSrc,
        imageName: null
      });
    }
  }


  render() {
    const { currentElement } = this.state;

    let srcValue = "";
    let fileName = "";

    if (currentElement) {
      const { src, imageName } = currentElement.props;

      // If not the default source or we don't have an imageName show src
      if (src !== defaultImageSource && !imageName) {
        srcValue = src;
      }

      if (imageName) {
        fileName = imageName;
      }
    }

    return (
      <div className={commonStyles.wrapper}>
        <h3 className={commonStyles.heading}>Image</h3>
        <h4 className={styles.imageSource}>
          Image source
        </h4>
        <input
          className={styles.imageSourceInput}
          type="text"
          name="imagesSource"
          onChange={this.onSourceChange}
          value={srcValue}
        />
        <h4 className={styles.fileUploadLabel}>
          File upload
        </h4>
        <h5>{fileName}</h5>
        <label>
          Choose a file to upload {/* TODO: Should this change if there's already a file? */}
          <input
            className={styles.fileUploadInput}
            type="file"
            name="imageFile"
            accept="image/x-png, image/gif, image/jpeg"
            onChange={this.onImageUpload}
          />
        </label>
      </div>
    );
  }
}
