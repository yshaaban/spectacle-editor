import React, { Component } from "react";
import styles from "./select.css";

export default class Option extends Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    children: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.string]).isRequired,
    onClick: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    automationId: React.PropTypes.string,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
    hoverClassName: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    isActive: React.PropTypes.bool
  }

  static defaultProps = {
    value: "",
    automationId: undefined,
    className: `${styles.option}`,
    activeClassName: "active",
    hoverClassName: "hover",
    onClick() {}
  }

  constructor(props) {
    super(props);

    this.displayName = "RadonSelectOption";
    this.state = {
      hovered: false
    };
  }

  getClassNames() {
    const classNames = [this.props.className];

    if (this.props.isActive) {
      classNames.push(this.props.activeClassName);
    }

    if (this.state.hovered) {
      classNames.push(this.props.hoverClassName);
    }

    return classNames.join(" ");
  }

  setHover(isHover) {
    this.setState({
      hovered: isHover
    });
  }

  tap() {
    this.props.onClick();
  }

  render() {
    return (
      <div
        role="button"
        className={this.getClassNames()}
        data-automation-id={this.props.automationId}
        tabIndex={-1}
        onTouchStart={this.tap}
        onMouseDown={this.props.onClick}
        onMouseEnter={this.setHover.bind(this, true)}
        onMouseLeave={this.setHover.bind(this, false)}
        onKeyDown={this.props.onKeyDown}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}
