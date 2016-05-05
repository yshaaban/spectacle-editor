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
}
