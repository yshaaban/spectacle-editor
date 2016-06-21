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

    this.state = { pickerIsOpen: false, currentColor: "#000" };
  }

  componentWillReceiveProps(props) {
    this.setState({
      currentColor: props.currentElement.props.style.color
    });
  }

  updateColor(hex) {
    if (this.props.currentElement.props.style.color !== hex) {
      const updatedColor = { color: hex };
      const updatedStyles = {
        ...this.props.currentElement.props.style,
        ...updatedColor
      };
      this.context.store.updateElementProps({ style: updatedStyles });
    }
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
    this.updateColor(color.hex);
  }

  render() {
    return (
      <div className={styles.colorWrapper}>
        <div
          onClick={this.handlePickerOpen}
          className={styles.colorPicker}
          style={{ background: this.state.currentColor }}
        >
        </div>
        <div
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
            color={this.state.currentColor}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
      </div>
    );
  }
}
