import React, { Component } from "react";
import { EYEDROPPER } from "../../../assets/icons";
import styles from "./colorpicker.css";
import { SketchPicker } from "react-color";

export default class ColorPicker extends Component {
  static propTypes = {
    currentElement: React.PropTypes.object
  }

  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = { pickerIsOpen: false };
  }

  updateColor(hex, opacity) {
    const style = this.props.currentElement.props.style;
    const updatedColor = {};

    if (style.color !== hex) {
      updatedColor.color = hex;
    }

    if (style.opacity !== opacity) {
      updatedColor.opacity = opacity;
    }

    if (!updatedColor.opacity && !updatedColor.color) {
      return;
    }

    const updatedStyles = {
      ...style,
      ...updatedColor
    };

    this.context.store.updateElementProps({ style: updatedStyles });
  }

  handlePickerClose = (ev) => {
    const findClassRecursively = (el) => {
      const classes = el.classList ? Array.prototype.slice.call(el.classList) : [];
      const hasClass = classes.indexOf("color-picker-element") > -1;

      if (hasClass) {
        return true;
      }

      if (!el.parentNode) {
        return false;
      }

      return findClassRecursively(el.parentNode);
    };

    if (!findClassRecursively(ev.target)) {
      ev.preventDefault();
      ev.stopPropagation();
      document.removeEventListener("mousedown", this.handlePickerClose, true);

      this.setState({ pickerIsOpen: false });
    }
  }

  handlePickerOpen = () => {
    document.addEventListener("mousedown", this.handlePickerClose, true);

    this.setState({ pickerIsOpen: true });
  }

  handleChangeComplete = (color) => {
    this.updateColor(color.hex, color.hsl.a);
  }

  getRGBAValues({ opacity = 1, color }) {
    const removeHash = color.replace(/^#/, "");

    return {
      r: parseInt(removeHash.slice(0, 2), 16),
      g: parseInt(removeHash.slice(2, 4), 16),
      b: parseInt(removeHash.slice(4), 16),
      a: opacity
    };
  }

  render() {
    const { currentElement } = this.props;
    const rgba = this.getRGBAValues(currentElement.props.style);
    console.log(rgba);
    return (
      <div className={styles.colorWrapper}>
        <div
          onClick={this.handlePickerOpen}
          className={styles.colorPickerTemplateBox}
          style={{ background: currentElement.props.style.color }}
        >
        </div>
        <div
          onClick={this.handlePickerOpen}
          className={styles.dropper}
          dangerouslySetInnerHTML={{ __html: EYEDROPPER }}
        >
        </div>
        <div
          className={
            `${styles.pickerWrapper}
             ${this.state.pickerIsOpen ? "" : styles.hidden}
             color-picker-element`
            }
        >
          <SketchPicker
            color={rgba}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      </div>
    );
  }
}
