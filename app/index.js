import React from "react";
import { render } from "react-dom";
import { Router, hashHistory } from "react-router";
import routes from "./routes";
import SlidesStore from "./stores/slides-store";
import Provider from "./components/utils/provider";

import "./app.global.css";

const store = new SlidesStore();

render(
  <Provider store={store}>
    <Router history={hashHistory} routes={routes} />
  </Provider>,
  document.getElementById("root")
);
