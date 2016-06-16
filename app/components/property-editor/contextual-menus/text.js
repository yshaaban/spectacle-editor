import React, { Component } from "react";
import styles from "../index.css";
import { autorun } from "mobx";
import { map, omit, find } from "lodash";
import {
  Select,
  Option,
  Alignment,
  Formatting,
  List,
  Incrementer
} from "../editor-components/index.js";
import { ElementTypes } from "../../../constants";
import { FontMap } from "../../../font-settings";

export default class TextMenu extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = { currentElement: null };
  }

  componentDidMount() {
    autorun(() => {
      const { currentElement } = this.context.store;

      window.clearTimeout(this.stateTimeout);

      if (!currentElement) {
        this.stateTimeout = window.setTimeout(() => {
          this.setState({ currentElement });
        }, 400);

        return;
      }

      if (currentElement.type === ElementTypes.TEXT) {
        this.setState({ currentElement });
      }
    });
  }

  handleFontFamily = (value, properties) => {
    const { currentElement } = this.context.store;

    if (properties && properties.style.fontFamily !== currentElement.props.style.fontFamily) {
      this.updateCurrentElementStyles(currentElement, {
        ...properties.style,
        fontWeight: 400,
        fontStyle: "normal"
      });
    }
  }

  handleFontStyles = (value, properties) => {
    if (properties) {
      const { currentElement } = this.context.store;
      const { currentWeight, currentStyle } = currentElement.props.style;
      const { fontWeight, fontStyle } = properties.style;

      if (fontWeight !== currentWeight || fontStyle !== currentStyle) {
        this.updateCurrentElementStyles(currentElement, omit(properties.style, "fontFamily"));
      }
    }
  }

  updateCurrentElementStyles = (currentElement, style) => {
    const oldStyles = currentElement.props.style;

    this.context.store.updateElementProps({
      style: { ...oldStyles, ...style }
    });
  }

  render() {
    const { currentElement } = this.state;
    const styleProps = currentElement && currentElement.props.style;
    let currentStyles;

    if (currentElement) {
      currentStyles = find(FontMap[styleProps.fontFamily].styles, {
        fontWeight: styleProps.fontWeight,
        fontStyle: styleProps.fontStyle
      });
    }

    return (
      <div className={styles.wrapper}>
        {
          currentElement &&
          (
          <div>
            <h3 className={styles.heading}>Text</h3>
            <hr />
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Paragraph Styles
              </div>
              <div>
                <Select
                  onChange={this.handleFontFamily}
                  selectName="FontType"
                  placeholderText={FontMap[styleProps.fontFamily].name}
                >
                  {map(FontMap, (fontObj, fontFamily) => (
                    <Option
                      key={fontFamily}
                      value={fontObj.name}
                      style={{ fontFamily }}
                    >
                        {fontObj.name}
                    </Option>
                    )
                  )}
                </Select>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Font
              </div>
              <div>
                <Select
                  onChange={this.handleFontStyles}
                  selectName="FontStyle"
                  placeholderText={currentStyles && currentStyles.name}
                >
                  {map(FontMap[styleProps.fontFamily].styles, (stylesObj, index) => {
                    const cleanedStylesObj = omit(stylesObj, "name");
                    cleanedStylesObj.fontFamily = styleProps.fontFamily;

                    return (
                      <Option
                        key={index}
                        value={stylesObj.name}
                        style={ cleanedStylesObj }
                      >
                        {stylesObj.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className={styles.flexrow}>
              <div>
                <div className={styles.subHeading}>
                  Size
                </div>
                <Incrementer
                  currentElement={this.state.currentElement}
                  propertyName={"fontSize"}
                />
              </div>
              <div>
                <div className={styles.subHeading}>
                  Color
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Alignment
              </div>
              <Alignment
                currentElement={this.state.currentElement}
              />
            </div>
            <hr className={styles.hr} />
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Formatting
              </div>
              <Formatting
                currentElement={this.state.currentElement}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                List
              </div>
              <List
                currentElement={this.state.currentElement}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.subHeading}>
                Link
              </div>
              <input type="text" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
