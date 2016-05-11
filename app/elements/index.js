import React from "react";

import { ElementTypes } from "../constants";
import { Image, Heading } from "../spectacle-components";

const elements = {};

elements[ElementTypes.TEXT] = {
  // Keep type for serialization and code switches
  // TODO: Figure out defaults for text element
  type: ElementTypes.TEXT,
  ComponentClass: Heading,
  props: { size: 4 },
  children: ["totally a text element"]
};

elements[ElementTypes.IMAGE] = {
  type: ElementTypes.IMAGE,
  ComponentClass: Image,
  props: {
    src: "http://placehold.it/400x200&text=sliding_yeah"
  },
  children: []
};

elements[ElementTypes.PLOTLY] = {
  type: ElementTypes.PLOTLY,
  ComponentClass: (props) => (<iframe {...props} />),
  props: {
    src: "https://plot.ly/~brandnewpeterson/487.embed",
    width: "450",
    height: "400",
    frameborder: "0",
    scrolling: "no"
  },
  children: []
};

elements[ElementTypes.IMAGE] = {
  type: ElementTypes.IMAGE,
  ComponentClass: Image,
  props: {
    src: "http://placehold.it/400x200&text=sliding_yeah"
  },
  children: []
};

elements[ElementTypes.CODE] = {
  type: ElementTypes.CODE,
  ComponentClass: Image,
  props: {
    src: "http://placehold.it/400x200&text=sliding_yeah"
  },
  children: []
};


export default elements;
