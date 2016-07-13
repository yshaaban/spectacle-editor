import React, { Component, PropTypes } from "react";
import { BRINGTOFRONT, BRINGFORWARD, SENDBACKWARD, SENDTOBACK } from "../../../../assets/icons";

import styles from "./index.css";

class Arrange extends Component {
  static contextTypes = {
    store: PropTypes.object
  };

  onClickAddSlide = () => {
    this.context.store.addSlide();
  }

  onClickDeleteSlide = () => {
    this.context.store.deleteSlide();
  }

  render() {
    return (
      <div className={styles.arrangeContainer}>
        <div className={styles.arrange}>
          <button className={styles.arrangeButton}>
            <i
              className={styles.arrangeIcon}
              dangerouslySetInnerHTML={{ __html: BRINGTOFRONT }}
              title="Bring to front"
            />
          </button>
          <button className={styles.arrangeButton}>
            <i
              className={styles.arrangeIcon}
              dangerouslySetInnerHTML={{ __html: BRINGFORWARD }}
              title="Bring forward"
            />
          </button>
          <button className={styles.arrangeButton}>
            <i
              className={styles.arrangeIcon}
              dangerouslySetInnerHTML={{ __html: SENDBACKWARD }}
              title="Send backward"
            />
          </button>
          <button className={styles.arrangeButton}>
            <i
              className={styles.arrangeIcon}
              dangerouslySetInnerHTML={{ __html: SENDTOBACK }}
              title="Send to back"
            />
          </button>
        </div>
      </div>
    );
  }
}

export default Arrange;
