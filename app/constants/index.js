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


const fontTypes = {
  thin: {
    name: "Thin",
    fontWeight: 100,
    fontStyle: "normal"
  },
  thinItalic: {
    name: "Thin Italic",
    fontWeight: 100,
    fontStyle: "italic"
  },
  extraLight: {
    name: "Extra Light",
    fontWeight: 200,
    fontStyle: "normal"
  },
  extraLightItalic: {
    name: "Extra Light Italic",
    fontWeight: 200,
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
    fontStyle: "normal"
  },
  italic: {
    name: "Regular Italic",
    fontWeight: 400,
    fontStyle: "italic"
  },
  medium: {
    name: "Medium",
    fontWeight: 500,
    fontStyle: "normal"
  },
  mediumItalic: {
    name: "Medium Italic",
    fontWeight: 500,
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
  },
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
  black: {
    name: "Black",
    fontWeight: 900,
    fontStyle: "normal"
  },
  blackItalic: {
    name: "Black Italic",
    fontWeight: 900,
    fontStyle: "italic"
  }
};

export const FontMap = {
  droidSans: {
    name: "Droid Sans",
    styles: [
      fontTypes.regular,
      fontTypes.bold
    ]
  },
  droidSansMono: {
    name: "Droid Sans Mono",
    styles: [
      fontTypes.regular
    ]
  },
  droidSerif: {
    name: "Droid Serif",
    styles: [
      fontTypes.regular,
      fontTypes.italic,
      fontTypes.bold,
      fontTypes.boldItalic
    ]
  },
  liberationSans: {
    name: "Liberation Sans",
    styles: [
      fontTypes.regular,
      fontTypes.italic,
      fontTypes.bold,
      fontTypes.boldItalic
    ]
  },
  openSans: {
    name: "Open Sans",
    styles: [
      fontTypes.light,
      fontTypes.lightItalic,
      fontTypes.regular,
      fontTypes.italic,
      fontTypes.semiBold,
      fontTypes.semiBoldItalic,
      fontTypes.bold,
      fontTypes.boldItalic,
      fontTypes.extraBold,
      fontTypes.extraBoldItalic
    ]
  },
  overPass: {
    name: "Overpass",
    styles: [
      fontTypes.extraLight,
      fontTypes.extraLightItalic,
      fontTypes.light,
      fontTypes.lightItalic,
      fontTypes.regular,
      fontTypes.italic,
      fontTypes.bold,
      fontTypes.boldItalic
    ]
  },
  ptSans: {
    name: "PT Sans",
    styles: [
      fontTypes.regular,
      fontTypes.bold
    ]
  },
  raleWay: {
    name: "Raleway",
    styles: [
      fontTypes.thin,
      fontTypes.thinItalic,
      fontTypes.extraLight,
      fontTypes.extraLightItalic,
      fontTypes.light,
      fontTypes.lightItalic,
      fontTypes.regular,
      fontTypes.italic,
      fontTypes.medium,
      fontTypes.mediumItalic,
      fontTypes.semiBold,
      fontTypes.semiBoldItalic,
      fontTypes.bold,
      fontTypes.boldItalic,
      fontTypes.extraBold,
      fontTypes.extraBoldItalic,
      fontTypes.black,
      fontTypes.blackItalic
    ]
  },
  roboto: {
    name: "Roboto",
    styles: [
      fontTypes.thin,
      fontTypes.thinItalic,
      fontTypes.light,
      fontTypes.lightItalic,
      fontTypes.regular,
      fontTypes.italic,
      fontTypes.medium,
      fontTypes.mediumItalic,
      fontTypes.bold,
      fontTypes.boldItalic,
      fontTypes.black,
      fontTypes.blackItalic
    ]
  }
};
