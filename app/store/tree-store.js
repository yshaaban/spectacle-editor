import { observable, computed, transaction } from "mobx";
import Immutable from "seamless-immutable";

export default class TreeStore {
  // Default tree state
  @observable history = Immutable.from([{
    component: "Heading"
  }]);
  @observable historyIndex = 0;

  // Not sure this is the best architecture, just wanted to get history working
  // Could work out well though...
  @computed({ asStructure: true }) get tree() {
    return this.history[this.historyIndex].asMutable();
  }

  @computed get undoDisabled() {
    return this.historyIndex === 0 || this.history.length <= 1;
  }

  @computed get redoDisabled() {
    return this.historyIndex >= this.history.length - 1;
  }

  constructor(tree) {
    if (tree) {
      this.history = Immutable.from([tree]);
    }
  }

  dropElement(elementType) {
    const newTree = { component: elementType };
    this._addToHistory(newTree);
  }

  undo() {
    // double check we're not trying to undo without history
    if (this.historyIndex === 0) {
      return;
    }

    this.historyIndex -= 1;
  }

  redo() {
    // Double check we've got a future to redo to
    if (this.historyIndex > this.history.length - 1) {
      return;
    }

    this.historyIndex += 1;
  }

  _addToHistory(newTree) {
    // Only notify observers once all expressions have completed
    transaction(() => {
      this.history = this.history.concat(Immutable.from(newTree));
      this.historyIndex += 1;
    });
  }
}
