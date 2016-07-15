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

  getList(type, text) {
    const { componentProps, classNames, style } = this.props;
    const liStyles = { ...style };

    if (type === "ordered") {
      liStyles.listStyle = "decimal";
    } else if (type === "unordered") {
      liStyles.listStyle = "disc";
    }

    return (
      <ol
        ref={(component) => {this.editor = component;}}
        {...componentProps}
        className={`${classNames.content}`}
        onBlur={this.handleBlur}
        style={{ ...style, whiteSpace: "pre-wrap" }}
        contentEditable="true"
        suppressContentEditableWarning
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onInput={this.handleInput}
      >
        {text.split("\n").map((line, i) => (
          <li
            className={
             `${classNames.line}`
            }
            style={liStyles}
            key={i}
          >
           {line}
          </li>)
        )}
      </ol>
    );
  }

  handleKeyDown = (ev) => {
    if (ev.which === 8 && ev.target.innerText.length <= 1) {
      ev.preventDefault();
    }
  }

  handleInput = (ev) => {
    this.setState({ content: ev.target.innerText });
  }

  handleBlur = () => {
    this.editor.style.cursor = "move";
    this.props.stopEditing();
    this.isHighLighted = false;

    const { placeholderText, children } = this.props;

    if (this.state.content === null && children) {
      this.editor.childNodes[0].innerText = children && children.split("\n")[0] || placeholderText;
      return;
    }

    this.context.store.updateChildren(
      this.editor.innerText,
      this.currentSlide,
      this.currentElement
    );
  }

  handleClick = (ev) => {
    const { isEditing, placeholderText } = this.props;
    const { content, contentToRender } = this.state;
    const sel = window.getSelection();
    const range = document.createRange();

    if (!isEditing) {
      ev.preventDefault();

      return;
    }

    if (content === null && contentToRender === placeholderText) {
      this.editor.childNodes[0].innerText = "";
    }

    if (!this.props.children) {
      ev.preventDefault();
      range.selectNodeContents(this.editor.childNodes[0]);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (!this.isHighLighted) {
      this.isHighLighted = true;
      const length = this.editor.childNodes.length;
      range.setStartBefore(this.editor.childNodes[0]);
      range.setEndAfter(this.editor.childNodes[length - 1]);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    this.editor.style.cursor = "text";
    this.currentSlide = this.context.store.currentSlideIndex;
    this.currentElement = this.context.store.currentElementIndex;
  }

  render() {
    const {
      classNames,
      componentProps,
      style
    } = this.props;

    return componentProps.listType ?
      this.getList(componentProps.listType, trimEnd(this.state.contentToRender, "\n"))
      :
      (<div
        ref={(component) => {this.editor = component;}}
        {...componentProps}
        className={classNames.content}
        onBlur={this.handleBlur}
        style={{ ...style, whiteSpace: "pre-wrap" }}
        contentEditable="true"
        suppressContentEditableWarning
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onInput={this.handleInput}
      >
        {trimEnd(this.state.contentToRender, "\n").split("\n").map((line, i) => (
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
        )}
      </div>);
  }
}

