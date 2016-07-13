import React, { Component } from "react";
import { BRINGTOFRONT, BRINGFORWARD, SENDBACKWARD, SENDTOBACK } from "../../../../assets/icons";

import styles from "./index.css";

class Arrange extends Component {
  onClickFront = () => {
    // TODO
    console.log("Bring to Front!");
  }

  onClickForward = () => {
    // TODO
    console.log("Increment forward by 1");
  }

  onClickBackward = () => {
    // TODO
    console.log("Decrement backward by 1");
  }

  onClickBack = () => {
    // TODO
    console.log("Send to back!");
  }

  render() {
    return (
      <div className={styles.arrangeContainer}>
        <div className={styles.arrange}>
          <button className={styles.arrangeButton} onClick={this.onClickFront}>
            <i
              className={styles.arrangeIcon}
              dangerouslySetInnerHTML={{ __html: BRINGTOFRONT }}
              title="Bring to front"
            />
          </button>
          <button className={styles.arrangeButton} onClick={this.onClickForward}>
            <i
              className={styles.arrangeIcon}
              dangerouslySetInnerHTML={{ __html: BRINGFORWARD }}
              title="Bring forward"
            />
          </button>
          <button className={styles.arrangeButton} onClick={this.onClickBackward}>
            <i
              className={styles.arrangeIcon}
              dangerouslySetInnerHTML={{ __html: SENDBACKWARD }}
              title="Send backward"
            />
          </button>
          <button className={styles.arrangeButton} onClick={this.onClickBack}>
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
