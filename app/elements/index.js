import React from "react";

import { ElementTypes } from "../constants";
import { Image, Heading } from "../spectacle-components";

const elements = {};

/*
* TODO: define style properties exposed to user
*
* It may be useful to add something like `userProps` to each element that
* defines which props are actually exposed to the user through the ui.
*
* Could be an array:
*
* userProps: ['size', 'font']
*
* Could be objects that provide more useful metadata & input rendering components:
*
* userProps: {
*   size: {
*     type: 'number',
*     ComponentClass: NumberInput
*   },
*   color: {
*     type: 'color',
*     ComponentClass: ColorInput
*   }
* }
*/

elements[ElementTypes.TEXT] = {
  // Values calculated at scale: 1
  width: 281,
  height: 61,
  // Keep type for serialization and code switches
  // TODO: Figure out defaults for text element
  type: ElementTypes.TEXT,
  ComponentClass: Heading,
  props: {
    style: {
      fontSize: 12,
      color: "#3d3d3d"
    }
  },
  children: "totally text"
};

elements[ElementTypes.IMAGE] = {
  // Values calculated at scale: 1
  width: 400,
  height: 200,
  type: ElementTypes.IMAGE,
  ComponentClass: Image,
  props: {
    src: "http://placehold.it/400x200&text=sliding_yeah"
  },
  children: []
};

elements[ElementTypes.PLOTLY] = {
  // Values calculated at scale: 1
  width: 450,
  height: 400,
  type: ElementTypes.PLOTLY,
  ComponentClass: (props) => (<iframe {...props} />),
  props: {
    src: "https://plot.ly/~brandnewpeterson/487.embed",
    width: 450,
    height: 400,
    frameBorder: 0,
    scrolling: "no"
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
