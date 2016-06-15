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
    styles: {
      bold: {
        name: "Bold",
        fontWeight: 700,
        fontStyle: "normal"
      },
      boldItalic: {
        name: "Bold Italic",
        fontWeight: 700,
        fontStyle: "italic"
      },
      extraBold: {
        name: "Extra Bold",
        fontWeight: 800,
        fontStyle: "normal"
      },
      extraBoldItalic: {
        name: "Extra Bold Italic",
        fontWeight: 800,
        fontStyle: "italic"
      },
      italic: {
        name: "Italic",
        fontWeight: 400,
        fontStyle: "italic"
      },
      light: {
        name: "Light",
        fontWeight: 300,
        fontStyle: "normal"
      },
      lightItalic: {
        name: "Light Italic",
        fontWeight: 300,
        fontStyle: "italic"
      },
      regular: {
        name: "Regular",
        fontWeight: 400,
        fontStyle: "italic"
      },
      semiBold: {
        name: "Semi-Bold",
        fontWeight: 600,
        fontStyle: "normal"
      },
      semiBoldItalic: {
        name: "Semi-Bold Italic",
        fontWeight: 600,
        fontStyle: "italic"
      }
    }
  }
};
