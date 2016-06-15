import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BLACKLIST_CURRENT_ELEMENT_DESELECT } from "../../../constants";
import styles from "./select.css";
import { CHEVRON } from "../../../assets/icons";


const keyboard = {
  space: 32,
  enter: 13,
  escape: 27,
  tab: 9,
  upArrow: 38,
  downArrow: 40
};

const doesOptionMatch = (option, str) => {
  const s = str.toLowerCase();

  if (typeof option.props.children === "string") {
    return option.props.children.toLowerCase().indexOf(s) === 0;
  }

  return option.props.value.toLowerCase().indexOf(s) === 0;
};

export default class Select extends Component {
  static defaultProps = {
    disabled: false,
    typeaheadDelay: 1000,
    showCurrentOptionWhenOpen: false,
    onChange() {},
    onBlur() {},
    className: "radon-select",
    openClassName: "open",
    focusClassName: `${styles.focus}`,
    listClassName: `${styles.list}`,
    currentOptionClassName: `${styles.selectBox}`,
    hiddenSelectClassName: "radon-select-hidden-select",
    disabledClassName: "radon-select-disabled",
    currentOptionStyle: {},
    optionListStyle: {}
  }

  static propTypes = {
    automationId: React.PropTypes.number,
    children: React.PropTypes.array,
    selectName: React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string,
    placeholderText: React.PropTypes.string,
    typeaheadDelay: React.PropTypes.number,
    showCurrentOptionWhenOpen: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    className: React.PropTypes.string,
    openClassName: React.PropTypes.string,
    focusClassName: React.PropTypes.string,
    listClassName: React.PropTypes.string,
    disabledClassName: React.PropTypes.string,
    currentOptionClassName: React.PropTypes.string,
    hiddenSelectClassName: React.PropTypes.string,
    currentOptionStyle: React.PropTypes.object,
    style: React.PropTypes.object,
    optionListStyle: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.displayName = "RadonSelect";

    const initialIndex = props.defaultValue !== undefined
      ? this.getValueIndex(props.defaultValue)
      : -1;
    const defaultValue = initialIndex === -1
      ? this.props.children[0].props.value
      : this.props.defaultValue;

    this.state = {
      selectedOptionIndex: initialIndex === -1 ? false : initialIndex,
      selectedOptionVal: defaultValue,
      open: false,
      focus: false
    };
  }

  onChange = () => {
    this.props.onChange(this.state.selectedOptionVal);
  }

  onFocus = () => {
    this.setState({
      focus: true
    });
  }

  onBlur = () => {
    this.setState({
      focus: false
    }, () => { this.props.onBlur(); });
  }

  onKeyDown = (ev) => {
    const isArrowKey = ev.keyCode === keyboard.upArrow || ev.keyCode === keyboard.downArrow;

    if (this.state.open) {
      ev.preventDefault();

      if (ev.keyCode === keyboard.enter ||
        ev.keyCode === keyboard.escape ||
        !this.typingAhead && ev.keyCode === keyboard.space) {
        this.toggleOpen();
      } else if (isArrowKey) {
        this.moveIndexByOne(ev.keyCode === keyboard.upArrow);
      } else if (ev.keyCode !== keyboard.tab) {
        this.typeahead(String.fromCharCode(ev.keyCode));
      }
    } else {
      if (ev.keyCode === keyboard.space || isArrowKey) {
        ev.preventDefault();
        this.toggleOpen();
      } else if (ev.keyCode !== keyboard.enter ||
        ev.keyCode !== keyboard.escape ||
        ev.keyCode !== keyboard.tab) {
        this.typeahead(String.fromCharCode(ev.keyCode));
      }
    }
  }

  onClickOption = (index, ev) => {
    const child = this.refs[`option${index}`];

    if (ev) {
      ev.preventDefault();
    }

    this.setState({
      selectedOptionIndex: index,
      selectedOptionVal: child.props.value,
      open: false
    }, () => {
      this.onChange();

      this.refs["currentOption"].focus(); // eslint-disable-line dot-notation
    });
  }

  onBlurOption = () => {
    if (this.isFocusing) {
      this.isFocusing = false;

      return;
    }

    const hoveredSelectEl = ReactDOM.findDOMNode(this).querySelector(":hover");

    if (hoveredSelectEl) {
      return;
    }

    this.toggleOpen();
  }

  onMouseDown = (ev) => {
    if (this.state.open) {
      ev.preventDefault();
    }
  }

  setValue = (val, silent) => {
    const index = this.getValueIndex(val);

    if (index !== -1) {
      this.setState({
        selectedOptionIndex: index,
        selectedOptionVal: val
      }, () => {
        if (!silent) {
          this.props.onChange(this.state.selectedOptionVal);
        }
      });
    }
  }

  getValue = () => this.state.selectedOptionVal

  getValueIndex = (val) => {
    for (let i = 0; i < this.props.children.length; ++i) {
      if (this.props.children[i].props.value === val) {
        return i;
      }
    }
    return -1;
  }

  getWrapperClasses = () => {
    const wrapperClassNames = [this.props.className];

    if (this.state.open) {
      wrapperClassNames.push(this.props.openClassName);
    }

    if (this.state.focus) {
      wrapperClassNames.push(this.props.focusClassName);
    }

    if (this.props.disabled) {
      wrapperClassNames.push(this.props.disabledClassName);
    }

    return wrapperClassNames.join(" ");
  }

  toggleOpen = () => {
    if (this.props.disabled) {
      return;
    }

    this.isFocusing = false;

    this.setState({
      open: !this.state.open,
      selectedOptionIndex: this.state.selectedOptionIndex || 0
    }, () => {
      this.onChange();

      if (!this.state.open) {
        this.focus(this.refs["currentOption"]); // eslint-disable-line dot-notation
      } else {
        this.focus(this.refs[`option${(this.state.selectedOptionIndex || 0)}`]);
      }
    });
  }

  typeahead = (character) => {
    let matchFound = false;
    let currentIndex = 0;

    if (this.state.selectedOptionIndex !== false &&
      this.state.selectedOptionIndex !== this.props.children.length - 1) {
      currentIndex = this.state.selectedOptionIndex + 1;
    }

    clearTimeout(this.typeaheadCountdown);

    this.typingAhead = true;
    this.currentString = this.currentString ? this.currentString + character : character;

    for (let i = currentIndex; i < this.props.children.length; i++) {
      if (doesOptionMatch(this.props.children[i], this.currentString)) {
        matchFound = i;
        break;
      }
    }

    if (!matchFound) {
      for (let j = 0; j <= currentIndex; j++) {
        if (doesOptionMatch(this.props.children[j], this.currentString)) {
          matchFound = j;
          break;
        }
      }
    }

    if (matchFound !== false) {
      this.setState({
        selectedOptionIndex: matchFound,
        selectedOptionVal: this.props.children[matchFound].props.value
      }, () => {
        this.onChange();

        if (this.state.open) {
          this.isFocusing = true;
          this.refs[`option${this.state.selectedOptionIndex}`].focus();
        }
      });
    }

    this.typeaheadCountdown = setTimeout(() => {
      this.typeaheadCountdown = undefined;
      this.typingAhead = false;
      this.currentString = "";
    }, this.props.typeaheadDelay);
  }

  moveIndexByOne(decrement) {
    let selectedOptionIndex = this.state.selectedOptionIndex || 0;

    if (decrement && this.state.selectedOptionIndex === 0 ||
      !decrement && this.state.selectedOptionIndex === this.props.children.length - 1) {
      return;
    }

    selectedOptionIndex += decrement ? -1 : 1;

    this.setState({
      selectedOptionIndex,
      selectedOptionVal: this.props.children[selectedOptionIndex].props.value
    }, () => {
      this.onChange();

      if (this.state.open) {
        this.isFocusing = true;
        this.focus(this.refs[`option${this.state.selectedOptionIndex}`]);
      }
    });
  }

  focus(ref) {
    ReactDOM.findDOMNode(ref).focus();
  }

  renderChild = (child, index) => React.cloneElement(child, {
    key: index,
    ref: `option${index}`,
    isActive: this.state.selectedOptionIndex === index,
    onClick: this.onClickOption.bind(this, index),
    onKeyDown: this.onKeyDown,
    automationId:
      `${(this.props.automationId ?
          this.props.automationId :
          "select")}
        -option-${index}`
  });

  renderSpacerChild(child, index) {
    return React.cloneElement(child, {
      key: index,
      style: {
        visibility: "hidden",
        height: "0 !important",
        paddingTop: 0,
        paddingBottom: 0
      }
    });
  }

  render() {
    let hiddenListStyle = { visibility: "hidden" };
    const selectedOptionContent = this.state.selectedOptionIndex !== false &&
      this.props.children[this.state.selectedOptionIndex].props.children;

    if (this.props.optionListStyle) {
      hiddenListStyle = { ...this.props.optionListStyle, ...hiddenListStyle };
    }
    return (
      <div
        className={this.getWrapperClasses()}
        onMouseDown={this.onMouseDown}
        style={this.props.style}
      >
        {this.props.showCurrentOptionWhenOpen || !this.state.open ?
          <div
            ref="currentOption"
            className={this.props.currentOptionClassName}
            tabIndex={0}
            data-automation-id={this.props.automationId}
            role="button"
            onFocus={this.onFocus}
            onKeyDown={this.onKeyDown}
            onBlur={this.onBlur}
            onClick={this.toggleOpen}
            aria-expanded={this.state.open}
            style={this.props.currentOptionStyle}
          >
            {
              selectedOptionContent ||
              this.props.placeholderText ||
              this.props.children[0].props.children
            }
            <span
              className={styles.chevronBox}
              dangerouslySetInnerHTML={{ __html: CHEVRON }}
            ></span>
          </div>
          :
          ""
        }
        {this.state.open ?
          <div
            className={
              `${this.props.listClassName} ${BLACKLIST_CURRENT_ELEMENT_DESELECT}`
            }
            onBlur={this.onBlurOption}
            style={this.props.optionListStyle}
          >
            {React.Children.map(this.props.children, this.renderChild)}
          </div>
          : ""
        }
        <select
          style={{ visibility: "hidden" }}
          disabled="true"
          name={this.props.selectName}
          value={this.state.selectedOptionVal}
          className={this.props.hiddenSelectClassName}
          tabIndex={-1}
          aria-hidden="true"
        >
          {React.Children.map(this.props.children, (child, index) =>
            <option key={index} value={child.props.value}>{child.props.value}</option>
          )}
        </select>
        <span aria-hidden="true" style={hiddenListStyle} tabIndex={-1} >
          <div style={{ visibility: "hidden", height: 0, position: "relative" }} >
            {React.Children.map(this.props.children, this.renderSpacerChild)}
          </div>
        </span>
      </div>
    );
  }
}
