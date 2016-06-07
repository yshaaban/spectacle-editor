import { ElementTypes } from "../../constants/"
const propertyMap = {};

propertyMap[ElementTypes.TEXT] = {
  fontSize: {
    type: "number",
    label: "Font size",
    propertyName: "fontSize",
    default: 12,
  }, 
  color: {
    type: "color",
    label: "Font color",
    propertyName: "color",
    default: "#ccc"
  }
};

export default propertyMap;
