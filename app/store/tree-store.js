import { observable } from "mobx";

export default class TreeStore {
  tree = observable({
    component: "FOOOOO"
  })

  constructor(tree) {
    if (tree) {
      this.tree = observable(tree);
    }
  }

  dropElement(elementType) {
    console.log("DROPPING ELEMENT", elementType);
    this.tree.component = elementType;
  }
}
