import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Motion, spring } from "react-motion";
import { omit, defer, trimEnd } from "lodash";

import {
  SpringSettings,
  BLACKLIST_CURRENT_ELEMENT_DESELECT
} from "../../../../constants";
import { getPointsToSnap, snap } from "../../../../utils";
import styles from "./index.css";
import ResizeNode from "../../resize-node";
import TextContentEditor from "./text-content-editor";

export default class TextElement extends Component {
  static propTypes = {
    elementIndex: PropTypes.number,
    component: PropTypes.shape({
      ComponentClass: React.PropTypes.any.isRequired,
      props: PropTypes.object,
      children: PropTypes.node
    }),
    selected: PropTypes.bool,
    mousePosition: PropTypes.array,
    scale: PropTypes.number,
    showGridLine: PropTypes.func,
    hideGridLine: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      currentContent: null,
      isPressed: false,
      mouseStart: [0, 0],
      delta: [0, 0]
    };
  }

  componentDidMount() {
    defer(() => {
      const { width, height } = this.currentElementComponent.getBoundingClientRect();

      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        width,
        height
      });
    });
  }

  shouldComponentUpdate() {
    // This is needed because of the way the component is passed down
    // React isn't re-rendering this when the contextual menu updates the store
    return true;
  }

  handleTouchStartResize = (ev) => {
    ev.preventDefault();
    this.handleMouseDownResize(ev.touches[0]);
  }

  handleMouseDownResize = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();

    this.context.store.updateElementResizeState(true);

    document.body.style.setProperty("cursor", "ew-resize", "important");
    const { target, pageX } = ev;
    const isLeftSideDrag = target === this.leftResizeNode;
    const { width, height } = this.currentElementComponent.getBoundingClientRect();
    const componentProps = this.props.component.props;
    const componentLeft = componentProps.style && componentProps.style.left;
    const left = componentLeft || 0;

    this.gridLines = this.context.store.gridLines;

    this.setState({
      isLeftSideDrag,
      isResizing: true,
      width,
      height,
      left,
      resizeLastX: pageX
    });

    window.addEventListener("mousemove", this.handleMouseMoveResize);
    window.addEventListener("touchmove", this.handleTouchMoveResize);
    window.addEventListener("mouseup", this.handleMouseUpResize);
    window.addEventListener("touchend", this.handleTouchEndResize);
  }

  handleTouchMoveResize = (ev) => {
    ev.preventDefault();
    this.handleMouseMoveResize(ev.touches[0]);
  }

  handleMouseMoveResize = (ev) => {
    ev.preventDefault();
    const { pageX } = ev;
    const { isLeftSideDrag, resizeLastX, width } = this.state;
    let { left } = this.state;
    let change;
    let isSnapped;

    const snapCallback = (line, index) => {
      if (line === null) {
        this.props.hideGridLine(true);
        isSnapped = false;
        return;
      }

      let pointToAlignWithLine;

      if (index === 0) {
        pointToAlignWithLine = left;
      }

      if (index === 1) {
        pointToAlignWithLine = Math.ceil(left + width / 2);
      }

      if (index === 2) {
        pointToAlignWithLine = Math.ceil(left + width);
      }

      const distance = Math.abs(pointToAlignWithLine - line);

      if (distance <= 3) {
        isSnapped = true;
        this.props.showGridLine(line, true);
      }
    };

    snap(
      this.gridLines.vertical,
      getPointsToSnap(
        left,
        width,
        (Math.max(pageX, resizeLastX) - Math.min(pageX, resizeLastX)) / 2
      ),
      snapCallback
    );

    if (isSnapped) {
      return;
    }

    if (isLeftSideDrag) {
      change = resizeLastX - pageX;
      left -= change;
    } else {
      change = pageX - resizeLastX;
    }

    const newWidth = change + width;

    if (newWidth >= 0) {
      this.setState({ left, width: (change + width), resizeLastX: pageX });
    }
  }

  handleTouchEndResize = (ev) => {
    ev.preventDefault();
    this.handleMouseUpResize(ev.touches[0]);
  }

  handleMouseUpResize = (ev) => {
    ev.preventDefault();
    window.removeEventListener("mousemove", this.handleMouseMoveResize);
    window.removeEventListener("mouseup", this.handleMouseUpResize);
    window.removeEventListener("touchmove", this.handleTouchMoveResize);
    window.removeEventListener("touchend", this.handleTouchEndResize);

    this.context.store.updateElementResizeState(false);

    this.props.hideGridLine(true);
    this.setState({
      isResizing: false
    });

    const { width, left } = this.state;
    const propStyles = { ...this.props.component.props.style };

    propStyles.width = width;
    propStyles.left = left;

    this.context.store.updateElementProps({ style: propStyles });

    // defer measuring new height, otherwise value will be what height was before resize
    defer(() => {
      this.setState({ height: this.currentElementComponent.clientHeight });
    });
  }

  handleTouchStart = (ev) => {
    ev.preventDefault();
    this.handleMouseDown(ev.touches[0]);
  }

  handleTouchMove = (ev) => {
    ev.preventDefault();
    this.handleMouseMove(ev.touches[0]);
  }

  handleMouseMove = ({ pageX, pageY, offsetX, offsetY, target: { id } }) => {
    const {
      mouseStart: [x, y],
      mouseOffset: [mouseOffsetX, mouseOffsetY],
      originalPosition: [originalX, originalY],
      width,
      height
    } = this.state;

    const newDelta = [pageX - x, pageY - y];

    // Note: This doesn't handle the case of the mouse being off the slide and part of the element
    // still on the slide. AKA no gridlines or snapping will occur when mouse is outside of the
    // slide.
    if (id === "slide") {
      const createSnapCallback = (isVertical, length, originalPoint) => (line, index) => {
        if (line === null) {
          this.props.hideGridLine(isVertical);

          return;
        }

        this.props.showGridLine(line, /* isVertical */ isVertical);

        // Index 0 = starting edge, 1 = middle, 2 = ending edge
        const offset = originalPoint + (length / 2 * index);

        // Set either x or y
        newDelta[isVertical ? 0 : 1] = line - offset;
      };
      snap(
        this.gridLines.horizontal,
        getPointsToSnap(offsetY, height, mouseOffsetY),
        createSnapCallback(false, height, originalY)
      );

      snap(
        this.gridLines.vertical,
        getPointsToSnap(offsetX, width, mouseOffsetX),
        createSnapCallback(true, width, originalX)
      );
    } else {
      this.props.hideGridLine(true);
      this.props.hideGridLine(false);
    }

    this.setState({
      delta: newDelta
    });
  }

  handleMouseDown = (ev) => {
    ev.preventDefault();

    if (this.context.store.currentElementIndex === this.props.elementIndex) {
      this.clickStart = new Date().getTime();
    }

    this.context.store.setCurrentElementIndex(this.props.elementIndex);

    const { pageX, pageY } = ev;
    const boundingBox = this.currentElementComponent.getBoundingClientRect();
    const mouseOffset = [Math.floor(boundingBox.left - pageX), Math.floor(boundingBox.top - pageY)];
    const originalPosition = [
      this.props.component.props.style.left,
      this.props.component.props.style.top
    ];
    const { width, height } = boundingBox;

    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("touchend", this.handleMouseUp);

    // Do this preemptively so that dragging doesn't take the performance hit
    this.gridLines = this.context.store.gridLines;

    // Only do drag if we hold the mouse down for a bit
    this.mouseClickTimeout = setTimeout(() => {
      this.clickStart = null;
      this.mouseClickTimeout = null;

      this.context.store.updateElementDraggingState(true, true);

      // Make the cursor dragging everywhere
      document.body.style.cursor = "-webkit-grabbing";

      // TODO: handle elements that aren't absolutely positioned?
      this.setState({
        delta: [0, 0],
        mouseStart: [pageX, pageY],
        isPressed: true,
        mouseOffset,
        originalPosition,
        width,
        height
      });

      window.addEventListener("touchmove", this.handleTouchMove);
      window.addEventListener("mousemove", this.handleMouseMove);
    }, 150);
  }

  handleMouseUp = () => {
    const timeSinceMouseDown = new Date().getTime() - this.clickStart;

    clearTimeout(this.mouseClickTimeout);

    if (this.clickStart && timeSinceMouseDown <= 150) {
      window.removeEventListener("mouseup", this.handleMouseUp);
      window.removeEventListener("touchend", this.handleMouseUp);

      this.clickStart = null;
      this.setState({ editing: true }, () => {
        this.handleClick();
      });

      return;
    }

    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleMouseUp);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    // Reset the cursor dragging to auto
    document.body.style.cursor = "auto";

    this.props.hideGridLine(false);
    this.props.hideGridLine(true);

    this.context.store.updateElementDraggingState(false);
    this.context.store.updateElementProps({
      style: {
        left: this.state.delta[0] + this.props.component.props.style.left,
        top: this.state.delta[1] + this.props.component.props.style.top
      }
    });

    this.setState({
      delta: [0, 0],
      mouseStart: [0, 0],
      isPressed: false
    });
  }

  handleClick = () => {
    this.editable.addEventListener("input", this.handleInput);
    this.editable.addEventListener("keypress", this.handleKeyPress);
    this.editable.addEventListener("blur", this.createUpdateElementChildren());
    window.addEventListener("click", this.createUpdateElementChildren());

    if (this.editable && this.editable.childNodes.length) {
      const range = document.createRange();
      const sel = window.getSelection();

      range.setStartAfter(this.editable.childNodes[0]);
      range.setEndAfter(this.editable.childNodes[0]);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    this.stopBlurEvent = false;
    this.editable.focus();

    if (!this.props.component.children) {
      this.setState({ currentContent: "" });
    }
  }

  handleKeyPress = (ev) => {
    if (ev.charCode === 13) {
      ev.preventDefault();

      const sel = window.getSelection();
      const caretPostion = sel.anchorOffset;
      // trim an extra line break if it's at the end.
      const innerText = ev.target.innerText.replace(/\n\n$/, "\n");
      const stringLength = innerText.length;
      const range = document.createRange();

      range.selectNodeContents(this.editable);
      sel.removeAllRanges();

      if (caretPostion === stringLength) {
        // add 2 line breaks because adding one doesn't create new line for some reason
        this.setState({ currentContent: `${innerText}\n\n` }, () => {
          range.setStart(this.editable.childNodes[0], this.state.currentContent.length);
          range.setEnd(this.editable.childNodes[0], this.state.currentContent.length);
          sel.addRange(range);
        });
      } else {
        this.setState({
          currentContent: `${innerText.slice(0, caretPostion)}\n${innerText.slice(caretPostion)}`
        }, () => {
          range.setStart(this.editable.childNodes[0], caretPostion + 1);
          range.setEnd(this.editable.childNodes[0], caretPostion + 1);
          sel.addRange(range);
        });
      }
    }
  }

  handleInput = (ev) => {
    ev.preventDefault();

    this.setState({
      currentContent: ev.target.innerText
    });
  }

  createUpdateElementChildren = () => {
    // closure variables to capture current store state as focus is lost.
    // if this is done during or after the blur event, store will have already
    // updated the element index upon deselect and slide index if another
    // slide is selected, making it impossible to update this element.
    const {
      currentState,
      currentSlideIndex,
      currentElementIndex
    } = this.context.store;

    const currentElementChildren =
      currentState.slides[currentSlideIndex].children[currentElementIndex].children;

    const updateElementChildren = (ev) => {
      ev.preventDefault();

      if (this.stopBlurEvent) {
        return;
      }

      if (ev.type === "blur" || ev.target !== this.editable) {
        window.removeEventListener("click", updateElementChildren);

        this.stopBlurEvent = true;
        this.editable.removeEventListener("blur", updateElementChildren);
        this.editable.removeEventListener("input", this.handleInput);
        this.editable.blur();

        const { currentContent } = this.state;

        if (typeof currentContent === "string" && currentContent !== currentElementChildren) {
          this.context.store.updateChildren(
            trimEnd(currentContent, "\n"),
            currentSlideIndex,
            currentElementIndex
          );
        }

        if (this.currentElementComponent) {
          const { width, height } = this.currentElementComponent.getBoundingClientRect();

          this.setState({ currentContent: null, editing: false, width, height });
        }
      }
    };

    return updateElementChildren;
  }

  render() {
    const {
      elementIndex,
      selected,
      component: { defaultText, props, children },
      mousePosition,
      scale
    } = this.props;

    const {
      currentContent,
      delta: [x, y],
      editing,
      isResizing,
      isPressed,
      width,
      left
    } = this.state;

    if (this.context.store.isResizing) {
      this.currentElementComponent.style.cursor = "ew-resize";
    } else if (this.currentElementComponent) {
      this.currentElementComponent.style.cursor = "move";
    }

    const currentlySelected = selected || elementIndex === this.context.store.currentElementIndex;
    const extraClasses = currentlySelected ? ` ${styles.selected}` : "";

    const wrapperStyle = {};
    const motionStyles = {};
    let elementStyle = props.style ? { ...props.style } : {};

    if (this.context.store.isDragging) {
      wrapperStyle.pointerEvents = "none";
    }


    if (mousePosition || props.style && props.style.position === "absolute") {
      wrapperStyle.position = "absolute";

      const mouseX = mousePosition && mousePosition[0] ? mousePosition[0] : null;

      motionStyles.left = spring(
        mouseX && mouseX || props.style.left || 0,
        SpringSettings.DRAG
      );

      const mouseY = mousePosition && mousePosition[1] ? mousePosition[1] : null;
      motionStyles.top = spring(
        mouseY && mouseY || props.style.top || 0,
        SpringSettings.DRAG
      );

      motionStyles.width = spring((width && width || 0), SpringSettings.RESIZE);

      if (mousePosition) {
        wrapperStyle.whiteSpace = "nowrap";
      }

      if (scale) {
        wrapperStyle.transform = `scale(${scale})`;
      }
    }

    elementStyle = { ...elementStyle, position: "relative", left: 0, top: 0 };

    if (this.props.component.props.style.width !== undefined || isResizing) {
      elementStyle = omit(elementStyle, "whiteSpace");
      elementStyle.wordBreak = "break-all";
    }

    if (isPressed) {
      motionStyles.left = spring((props.style && props.style.left || 0) + x, SpringSettings.DRAG);
      motionStyles.top = spring((props.style && props.style.top || 0) + y, SpringSettings.DRAG);
    }


    if (isResizing) {
      const componentStylesLeft = props.style && props.style.left || 0;

      motionStyles.left = spring(
        left === undefined ? componentStylesLeft : left,
        SpringSettings.RESIZE
      );
      motionStyles.width = spring(width, SpringSettings.RESIZE);
    }

    const content = typeof currentContent === "string" ? currentContent : children;

    return (
        <Motion
          style={motionStyles}
        >
          {computedStyles => {
            const computedDragStyles = omit(computedStyles, "width");
            let computedResizeStyles = omit(computedStyles, "top", "left");

            if (!isResizing) {
              computedResizeStyles = {};
            }

            return (
              <div
                className={
                  `${styles.canvasElement} ${extraClasses} ${BLACKLIST_CURRENT_ELEMENT_DESELECT}`
                }
                ref={component => {this.currentElementComponent = component;}}
                style={{ ...wrapperStyle, ...computedDragStyles }}
                onMouseDown={!editing && this.handleMouseDown}
                onTouchStart={this.handleTouchStart}
              >
                {currentlySelected && !editing &&
                  <ResizeNode
                    ref={component => {this.leftResizeNode = ReactDOM.findDOMNode(component);}}
                    alignLeft
                    handleMouseDownResize={this.handleMouseDownResize}
                    handleTouchResize={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
                <TextContentEditor
                  ref={component => {
                    if (editing) {
                      this.editable = ReactDOM.findDOMNode(component);
                    }
                  }}
                  lineClass={styles.line}
                  editorClass={styles.editor}
                  isEditing={editing}
                  placeholderText={defaultText}
                  componentProps={props}
                  contentClass={styles.content}
                  style={{ ...elementStyle, ...computedResizeStyles }}
                  content={content}
                />
                {currentlySelected && !editing &&
                  <ResizeNode
                    handleMouseDownResize={this.handleMouseDownResize}
                    handleTouchResize={this.handleTouchStartResize}
                    component={this.props.component}
                  />
                }
              </div>
          );}}
        </Motion>
    );
  }
}
