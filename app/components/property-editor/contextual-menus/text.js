import React, { Component } from "react";
import styles from "../index.css";
import { autorun } from "mobx";
import { map, omit } from "lodash";
import {
  Select,
  Option,
  Alignment,
  Formatting,
  List,
  Incrementer
} from "../editor-components/index.js";
import { ElementTypes, FontMap } from "../../../constants";

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

  updateCurrentElementStyles = (value, properties) => {
    if (properties) {
      const { style } = properties;
      const { currentElement } = this.context.store;
      const oldStyles = currentElement.props.style;

      this.context.store.updateElementProps({
        style: { ...oldStyles, ...style }
      });
    }
  }

  render() {
    const { currentElement } = this.state;
    const currentFont = currentElement && currentElement.props.style.fontFamily;

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
                  onChange={this.updateCurrentElementStyles}
                  selectName="FontType"
                >
                  {map(FontMap, (fontObj, fontFamily) => (
                    <Option
                      key={fontFamily}
                      value={fontObj.name}
                      style={{
                        fontFamily,
                        fontWeight: 400,
                        fontStyle: "normal"
                      }}
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
                  onChange={this.updateCurrentElementStyles}
                  selectName="FontType"
                  placeholderText={"Normal"}
                >
                  {map(FontMap[currentFont].styles, (stylesObj, index) => {
                    const cleanedStylesObj = omit(stylesObj, "name");

                    return (
                      <Option
                        key={index}
                        value={stylesObj.name}
                        style={cleanedStylesObj}
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
