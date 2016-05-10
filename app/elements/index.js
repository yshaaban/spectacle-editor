import React from "react";

import { ElementTypes } from "../constants";

const elements = {};

elements[ElementTypes.TEXT] = {
  // Keep type for serialization and code switches
  type: ElementTypes.TEXT,
  ComponentClass: (props) => (<div>{props.children}</div>),
  props: {},
  children: ["totally a text element"]
};

elements[ElementTypes.IMAGE] = {
  type: ElementTypes.IMAGE,
  ComponentClass: (props) => (<img {...props} />),
  props: {
    src: "http://placehold.it/400x200&text=sliding_yeah"
  },
  children: []
};

export default elements;
