import React, { Component } from "react";


export default class TextContentEditor extends Component {
  static propTypes = {
    isEditing: React.PropTypes.bool,
    placeholderText: React.PropTypes.string,
    classNames: React.PropTypes.object,
    componentProps: React.PropTypes.object,
    style: React.PropTypes.object,
    content: React.PropTypes.string
  }

  render() {
    const {
      classNames,
      componentProps,
      isEditing,
      placeholderText,
      style,
      content
    } = this.props;

    return isEditing ?
      (<div
        contentEditable="true"
        suppressContentEditableWarning
        ref={component => {this.editable = component;}}
        {...componentProps}
        className={`${classNames.content} ${classNames.editor}`}
        style={{ ...style, whiteSpace: "pre-wrap" }}
      >
        {content !== null ?
          content
          :
          placeholderText
        }
      </div>)
      :
      (<div
        {...componentProps}
        className={classNames.content}
        style={style}
      >
        {content !== null ?
          content.split("\n").map((line, i) => (
            <p className={`${classNames.line} ${classNames.orderedList}`} style={style} key={i}>
              {line}
            </p>)
          )
          :
          placeholderText
        }
      </div>);
  }
}

