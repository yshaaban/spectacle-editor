import React, { Component } from "react";


export default class TextContentEditor extends Component {
  static propTypes = {
    isEditing: React.PropTypes.bool,
    placeholderText: React.PropTypes.string,
    contentClass: React.PropTypes.string,
    editorClass: React.PropTypes.string,
    lineClass: React.PropTypes.string,
    componentProps: React.PropTypes.object,
    style: React.PropTypes.object,
    content: React.PropTypes.string
  }
  render() {
    const {
      editorClass,
      lineClass,
      componentProps,
      isEditing,
      contentClass,
      placeholderText,
      style,
      content
    } = this.props;

    return isEditing ?
      (<div
        contentEditable="true"
        ref={component => {this.editable = component;}}
        {...componentProps}
        className={`${contentClass} ${editorClass}`}
        style={Object.assign(style, { whiteSpace: "pre-wrap" })}
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
        className={contentClass}
        style={style}
      >
        {content !== null ?
          content.split("\n").map((line, i) => (
            <p className={lineClass} style={style} key={i}>
              {line}
            </p>)
          )
          :
          placeholderText
        }
      </div>);
  }
}

