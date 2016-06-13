export const DraggableTypes = {
  UI_ELEMENT: "UI_ELEMENT"
};

// TODO: Revise list?
export const ElementTypes = {
  HEADING: "Heading",
  TEXT: "Text",
  LIST: "List",
  LINK: "Link",
  IMAGE: "Image",
  PLOTLY: "Plotly",
  PLOTY_PLACEHOLDER_IMAGE: "Plotly Placeholder",
  CODE: "Code",
  QUOTE: "Quote",
  TABLE: "Table",
  IFRAME: "IFrame"
};

export const IconTypes = {
  ...ElementTypes
};

export const SpringSettings = {
  DRAG: { stiffness: 1000, damping: 50 }
};

export const BLACKLIST_CURRENT_ELEMENT_DESELECT = "ignoreElementDeselect";
