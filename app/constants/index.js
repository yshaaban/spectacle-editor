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

export const SNAP_DISTANCE = 15;
export const BLACKLIST_CURRENT_ELEMENT_DESELECT = "ignoreElementDeselect";

export const FontMap = {
  openSans: {
    name: "Open Sans",
    styles: [
      {
        name: "Light",
        fontWeight: 300,
        fontStyle: "normal"
      },
      {
        name: "Light Italic",
        fontWeight: 300,
        fontStyle: "italic"
      },
      {
        name: "Regular",
        fontWeight: 400,
        fontStyle: "normal"
      },
      {
        name: "Italic",
        fontWeight: 400,
        fontStyle: "italic"
      },
      {
        name: "Semi-Bold",
        fontWeight: 600,
        fontStyle: "normal"
      },
      {
        name: "Semi-Bold Italic",
        fontWeight: 600,
        fontStyle: "italic"
      },
      {
        name: "Bold",
        fontWeight: 700,
        fontStyle: "normal"
      },
      {
        name: "Bold Italic",
        fontWeight: 700,
        fontStyle: "italic"
      },
      {
        name: "Extra Bold",
        fontWeight: 800,
        fontStyle: "normal"
      },
      {
        name: "Extra Bold Italic",
        fontWeight: 800,
        fontStyle: "italic"
      }
    ]
  }
};
