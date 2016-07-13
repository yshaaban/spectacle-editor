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

  componentWillReceiveProps(nextProps) {
    if (this.props.componentProps.listType !== nextProps.componentProps.listType) {
      this.setState({ contentToRender: this.props.children });
    }
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

    const { placeholderText, children } = this.props;

    if (this.state.content === null) {
      this.editor.childNodes[0].innerText = children && children || placeholderText;
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
  }

  getList(type, text) {
    const { componentProps, classNames, style } = this.props;
    if (type === "ordered") {
      return (
        <ol
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
          {text.split("\n").map((line, i) => (
            <li
              className={
               `${classNames.content}
                ${classNames.line}`
              }
              style={{ ...style, listStyle: "initial" }}
              key={i}
            >
             {line}
            </li>)
          )}
        </ol>
      );
    }
  }

  render() {
    console.log(document.getElementById("editor"));
    const {
      classNames,
      componentProps,
      style
    } = this.props;

    return componentProps.listType && this.props.children ?
      this.getList(componentProps.listType, trimEnd(this.state.contentToRender, "\n"))
      :
      (<div
        id="editor"
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

