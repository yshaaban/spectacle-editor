import React from "react";
import { render } from "react-dom";
import { Router, hashHistory } from "react-router";
import routes from "./routes";

import "./app.global.css";

/**
 * redefinition of console.error is done because
 * app/components/canvas/element-types/text-element.js
 * uses attribute, "contentEditable", which alows for editing
 * of DOM elements by user input. This can result in updates
 * occuring on the DOM outside of the scope of react, and
 * results in warnings that flood the console. This IIFE
 * ignores those warnings
 */
window.console.error = (() => {
  const error = window.console.error;

  return (...args) => {
    if ((`${args[0]}`).indexOf("Warning: A component is `contentEditable`") !== 0) {
      error.apply(window.console, args);
    }
  };
})();

render(
  <Router history={hashHistory} routes={routes} />,
  document.getElementById("root")
);
