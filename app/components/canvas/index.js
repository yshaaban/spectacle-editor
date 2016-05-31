import React, { Component, PropTypes } from "react";
import { findDOMNode } from "react-dom";
import { observer } from "mobx-react";

// Nesting the ElementList here so drag and drop state is controlled by this component
import { ElementTypes } from "../../constants";
import ElementList from "../element-list";
import Elements from "../../elements";
import CanvasElement from "./canvas-element";
import Slide from "./slide";
import styles from "./index.css";

const padding = 40;

@observer
class SlideList extends Component {
  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      scale: 1,
      isOverPosition: null,
      isDragging: false,
      // TODO: Center and size element based on startup window size
      width: 0,
      height: 0,
      slideTop: 0,
      slideLeft: 0
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

  changeIsOverState = (newIsOverPosition, dragElementType) => {
    this.setState({
      isOverPosition: newIsOverPosition,
      dragElementType
    });
  }

  // Keep a 4:3 ratio with the inner element centered, 30px padding
  resize = () => {
    const { offsetWidth, offsetHeight } = findDOMNode(this.refs.container);

    const effectiveWidth = offsetWidth - (padding * 2);
    const effectiveHeight = offsetHeight - (padding * 2);

    const isWidthConstrained = effectiveHeight / effectiveWidth > 0.75;

    const width = isWidthConstrained ? effectiveWidth : effectiveHeight / 0.75;
    const height = isWidthConstrained ? effectiveWidth * 0.75 : effectiveHeight;

    const slideTop = isWidthConstrained ? (offsetHeight - height) / 2 : padding;
    const slideLeft = isWidthConstrained ? padding : (offsetWidth - width) / 2;

    // TODO: need better logic for handling scale and content scale
    const scale = 1;

    this.setState({ width, height, slideTop, slideLeft, scale });
  }

  dropElement = (elementType, position) => {
    if (!position) {
      this.context.store.dropElement(elementType, { style: { whiteSpace: "nowrap" } });

      return;
    }

    const [x, y] = position;
    const { slideLeft, slideTop } = this.state;
    const element = Elements[elementType];
    const { height, width } = element;


    this.context.store.dropElement(elementType, /* props */{
      style: {
        position: "absolute",
        left: x - (width / 2) - slideLeft - 1, // 1px for slide border
        top: y - (height / 2) - slideTop - 1, // 1px for slide border
        whiteSpace: "nowrap"
      }
    });
  }

  render() {
    const {
      scale,
      isOverPosition,
      dragElementType,
      width,
      height,
      slideTop,
      slideLeft
    } = this.state;

    const { isDraggingElement, isDraggingSlide } = this.context.store;

    const PreviewElementType = dragElementType === ElementTypes.PLOTLY ?
      ElementTypes.PLOTY_PLACEHOLDER_IMAGE :
      dragElementType;

    const component = Elements[PreviewElementType];

    return (
      <div
        className={styles.canvasWrapper}
        style={{
          cursor: isDraggingElement ? "-webkit-grabbing" : "auto",
          pointerEvents: isDraggingSlide ? "none" : "auto"
        }}
      >
        <div className={styles.canvas} id="canvas" ref="container">
          <div
            style={{
              position: "absolute",
              transform: `scale(${scale})`,
              width, // Hardcoded to 1100:850 aspect ratio
              height,
              top: slideTop,
              left: slideLeft,
              backgroundColor: "#999",
              pointerEvents: isDraggingElement || isDraggingSlide ? "none" : "auto"
            }}
          >
            <Slide isOver={isOverPosition} />
          </div>
          {isOverPosition &&
            <CanvasElement mousePosition={isOverPosition} scale={scale} component={component} />
          }
        </div>
        <ElementList
          scale={scale}
          onIsOverCanvasChange={this.changeIsOverState}
          onDropElement={this.dropElement}
        />
      </div>
    );
  }
}

export default SlideList;
