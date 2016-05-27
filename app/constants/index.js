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
