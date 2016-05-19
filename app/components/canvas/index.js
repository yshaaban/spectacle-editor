import React, { Component } from "react";
import { findDOMNode } from "react-dom";

// Nesting the ElementList here so drag and drop state is controlled by this component
import ElementList from "../element-list";
import Slide from "./slide";
import styles from "./index.css";

class SlideList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: 1
    };
  }

  componentDidMount() {
    this.resize();

    window.addEventListener("load", this.resize);
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("load", this.resize);
    window.removeEventListener("resize", this.resize);
  }

  resize = () => {
    const container = findDOMNode(this.container);

    // TODO: Hardcoded to 1100:850 aspect ratio
    const scale = (container.offsetWidth / 1100);

    this.setState({ scale });
  }

  render() {
    const { scale } = this.state;

    return (
      <div className={styles.canvasWrapper}>
        <ElementList />
        <div className={styles.canvas}>
          <div className={styles.slideWrapper} ref={(ref) => { this.container = ref; }}>
            <div
              className={styles.slideContent}
              style={{
                transform: `scale(${scale})`,
                width: 1100, // Hardcoded to 1100:850 aspect ratio
                height: 850
              }}
            >
              <Slide />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SlideList;
