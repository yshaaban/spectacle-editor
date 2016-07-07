import React, { Component } from "react";


export default class TextContentEditor extends Component {
  static propTypes = {
    isEditing: React.PropTypes.bool,
    placeholderText: React.PropTypes.string,
    editorClass: React.PropTypes.string,
    componentProps: React.PropTypes.object,
    style: React.PropTypes.object,
    content: React.PropTypes.string
  }
  render() {
    const {
      componentProps,
      isEditing,
      editorClass,
      placeholderText,
      style,
      content
    } = this.props;

    return isEditing ?
      (<div
        contentEditable="true"
        ref={component => {this.editable = component;}}
        {...componentProps}
        className={editorClass}
        style={Object.assign(style, { whiteSpace: "pre" })}
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
        className={editorClass}
        style={style}
      >
        {content !== null ?
          content.split("\n").map((line, i) => (
            <p style={style} key={i}>
              {line}
            </p>)
          )
          :
          placeholderText
        }
      </div>);
  }
}

