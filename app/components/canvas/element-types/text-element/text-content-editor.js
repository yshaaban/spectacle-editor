import React, { Component } from "react";
import { trimEnd } from "lodash";

export default class TextContentEditor extends Component {
  static propTypes = {
    isEditing: React.PropTypes.bool,
    placeholderText: React.PropTypes.string,
    classNames: React.PropTypes.object,
    componentProps: React.PropTypes.object,
    style: React.PropTypes.object,
    children: React.PropTypes.string,
    stopEditing: React.PropTypes.func
  }

  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = { content: null };
  }

  componentWillMount() {
    if (this.props.children) {
      this.setState({ contentToRender: this.props.children });

      return;
    }

    this.setState({ contentToRender: this.props.placeholderText });
  }

  handleClick = (ev) => {
    const { isEditing, placeholderText } = this.props;
    const { content, contentToRender } = this.state;

    if (!isEditing && !this.state.content) {
      return;
    }

    if (content === null && contentToRender === placeholderText) {
      this.editor.childNodes[0].innerText = "";
    }

    if (!this.props.children && !this.active) {
      ev.preventDefault();
      this.active = true;
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(this.editor.childNodes[0]);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    this.editor.style.cursor = "text";
    this.currentSlide = this.context.store.currentSlideIndex;
    this.currentElement = this.context.store.currentElementIndex;
  }

  handleBlur = () => {
    this.props.stopEditing();
    this.active = false;
    this.editor.style.cursor = "move";

    if (this.state.content === null) {
      this.editor.innerText = this.props.placeholderText;
      return;
    }

    this.context.store.updateChildren(
      this.editor.innerText,
      this.currentSlide,
      this.currentElement
    );
  }

  handleInput = (ev) => {
    this.setState({ content: ev.target.innerText });
    // if (ev.charCode === 13) {
    //   ev.preventDefault();

    //   const sel = window.getSelection();
    //   const caretPostion = sel.anchorOffset;
    //   const range = document.createRange();
    //   const allElementTextArray = this.editor.innerText.split("/n");
    //   const currentNodeIndex = Array.prototype.indexOf.call(this.editor.children, ev.target);
    //   const innerText = ev.target.innerText;
    //   const before = innerText.slice(0, caretPostion);
    //   const after = innerText.slice(caretPostion);

    //   allElementTextArray[currentNodeIndex] = `${before}\n${after}`;

    //   this.setState({ content: allElementTextArray.join("\n") });
      // this.setState({ content: })

      // if (caretPostion === stringLength) {
      //   // add 2 line breaks because adding one doesn't create new line for some reason
      //   this.setState({ currentContent: `${innerText}\n\n` }, () => {
      //     range.setStart(this.editable.childNodes[0], this.state.currentContent.length);
      //     range.setEnd(this.editable.childNodes[0], this.state.currentContent.length);
      //     sel.addRange(range);
      //   });
      // } else {
      //   this.setState({
      //     currentContent: `${innerText.slice(0, caretPostion)}\n${innerText.slice(caretPostion)}`
      //   }, () => {
      //     range.setStart(this.editable.childNodes[0], caretPostion + 1);
      //     range.setEnd(this.editable.childNodes[0], caretPostion + 1);
      //     sel.addRange(range);
      //   });
      // }
    // }
  }

  getList(type, text) {
    const { classNames, style } = this.props;

    if (type === "ordered") {
      return (
        <ol>
          {text.split("\n").map((line, i) => {
            console.log(line);
            return (
            <li
              className={
               `${classNames.content}
                ${classNames.line}`
              }
              style={{...style, listStyle: "initial" }}
              key={i}
            >
             {line}
            </li>);
          })}
        </ol>
      );
    }
  }

  render() {
    const {
      classNames,
      componentProps,
      style
    } = this.props;

    return (
      <div
        ref={(component) => {this.editor = component;}}
        {...componentProps}
        className={classNames.content}
        onBlur={this.handleBlur}
        style={{ ...style, whiteSpace: "pre-wrap" }}
        contentEditable="true"
        suppressContentEditableWarning
        onClick={this.handleClick}
        onInput={this.handleInput}
      >
        {componentProps.listType && this.props.children ?
          this.getList(componentProps.listType, trimEnd(this.state.contentToRender, "\n"))
          :
          trimEnd(this.state.contentToRender, "\n").split("\n").map((line, i) => (
            <p
              className={
                `${classNames.content}
                 ${classNames.line}`
              }
              style={style}
              key={i}
            >
              {line}
            </p>)
          )
        }
      </div>
    );
  }
}

