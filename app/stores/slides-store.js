import { observable, computed, transaction } from "mobx";
import Immutable from "seamless-immutable";
import { generate } from "shortid";

import elementMap from "../elements";

// TODO: REMOVE. Useful for testing
const allColors = [
  "#EF767A", "#456990", "#49BEAA", "#49DCB1", "#EEB868", "#EF767A", "#456990",
  "#49BEAA", "#49DCB1", "#EEB868", "#EF767A"
];

export default class SlidesStore {
  // Default slides state
  // history will be an array of slides arrays
  @observable history = Immutable.from([{
    currentSlideIndex: 0,
    currentElementIndex: null,
    slides: [{
      // Default first slide
      id: generate(),
      props: {},
      children: [],
      color: allColors[0]
    }, {
      id: generate(),
      props: {},
      children: [],
      color: allColors[1]
    }, {
      id: generate(),
      props: {},
      children: [],
      color: allColors[2]
    }, {
      id: generate(),
      props: {},
      children: [],
      color: allColors[3]
    }, {
      id: generate(),
      props: {},
      children: [],
      color: allColors[4]
    }
  ] }]);

  @observable historyIndex = 0;

  // Returns a new mutable object. Functions as a cloneDeep.
  @computed get slides() {
    return this.history[this.historyIndex].slides.asMutable({ deep: true });
  }

  @computed get currentSlideIndex() {
    return this.history[this.historyIndex].currentSlideIndex;
  }

  @computed get currentElementIndex() {
    return this.history[this.historyIndex].currentElementIndex;
  }

  // Returns a new mutable object. Functions as a cloneDeep.
  @computed get currentSlide() {
    return this.slides[this.currentSlideIndex];
  }

  // Returns a new mutable object. Functions as a cloneDeep.
  @computed get currentElement() {
    return this.currentElementIndex && this.currentSlide[this.currentElementIndex];
  }

  @computed get undoDisabled() {
    return this.historyIndex === 0 || this.history.length <= 1;
  }

  @computed get redoDisabled() {
    return this.historyIndex >= this.history.length - 1;
  }

  @computed get snapshot() {
    return this.history[this.historyIndex].asMutable({ deep: true });
  }

  constructor(slides) {
    if (slides) {
      this.history = Immutable.from([{
        currentSlideIndex: 0,
        currentElementIndex: null,
        slides
      }]);
    }
  }

  dropElement(elementType) {
    const slideToAddTo = this.currentSlide;
    const newSlidesArray = this.slides;

    slideToAddTo.children.push({
      ...elementMap[elementType],
      id: generate()
    });

    newSlidesArray[this.currentSlideIndex] = slideToAddTo;
    const elementIndex = this.currentElementIndex ?
        this.currentElementIndex + 1 :
        slideToAddTo.children.length - 1;

    this._addToHistory({
      currentSlideIndex: this.currentSlideIndex,
      currentElementIndex: elementIndex,
      slides: newSlidesArray
    });
  }

  setCurrentElementIndex(newIndex) {
    const snapshot = this.snapshot;
    snapshot.currentElementIndex = newIndex;

    transaction(() => {
      const left = this.history.slice(0, this.historyIndex);
      const right = this.history.slice(this.historyIndex + 1, this.history.length);
      this.history = left.concat([snapshot], right);
    });
  }

  setSelectedSlideIndex(newSlideIndex) {
    const snapshot = this.snapshot;
    snapshot.currentElementIndex = null;
    snapshot.currentSlideIndex = newSlideIndex;

    transaction(() => {
      const left = this.history.slice(0, this.historyIndex);
      const right = this.history.slice(this.historyIndex + 1, this.history.length);
      this.history = left.concat([snapshot], right);
    });
  }

  moveSlide(currentIndex, newIndex) {
    const slidesArray = this.slides;

    slidesArray.splice(newIndex, 0, slidesArray.splice(currentIndex, 1)[0]);

    this._addToHistory({
      currentSlideIndex: newIndex,
      slides: slidesArray
    });
  }

  addSlide() {
    const slidesArray = this.slides;

    // TODO: Figure out new slide defaults/interface
    const newSlide = {
      id: generate(),
      props: {},
      children: [],
      color: allColors[6]
    };

    const index = this.currentSlideIndex + 1;
    slidesArray.splice(index, 0, newSlide);

    this._addToHistory({
      currentSlideIndex: index,
      currentElementIndex: null,
      slides: slidesArray
    });
  }

  deleteSlide() {
    const slidesArray = this.slides;
    const index = this.currentSlideIndex === 0 ? 0 : this.currentSlideIndex - 1;

    slidesArray.splice(this.currentSlideIndex, 1);

    this._addToHistory({
      currentSlideIndex: index,
      currentElementIndex: null,
      slides: slidesArray
    });
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

  // TODO: Cap history length to some number to prevent absurd memory leaks
  _addToHistory(snapshot) {
    // Only notify observers once all expressions have completed
    transaction(() => {
      // If we have a future and we do an action, remove the future.
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }

      // Wrapp the new slides array in an array so they aren't concatted as individual slide objects
      this.history = this.history.concat([Immutable.from(snapshot)]);
      this.historyIndex += 1;
    });
  }
}
