import { observable, computed, transaction } from "mobx";
import Immutable from "seamless-immutable";
import { generate } from "shortid";
import { findIndex } from "lodash";

export default class SlidesStore {
  // Default slides state
  // history will be an array of slides arrays
  @observable history = Immutable.from([[{
    // Default first slide
    id: generate(),
    props: {},
    children: []
  }, {
    id: generate(),
    props: {},
    children: []
  }, {
    id: generate(),
    props: {},
    children: []
  }, {
    id: generate(),
    props: {},
    children: []
  }, {
    id: generate(),
    props: {},
    children: []
  }]]);
  @observable historyIndex = 0;
  @observable currentSlideIndex = 0;

  // Returns a new mutable object. Functions as a cloneDeep.
  @computed get slides() {
    return this.history[this.historyIndex].asMutable({ deep: true });
  }

  // Returns a new mutable object. Functions as a cloneDeep.
  @computed({ asStructure: true }) get currentSlide() {
    return this.slides[this.currentSlideIndex];
  }

  @computed get undoDisabled() {
    return this.historyIndex === 0 || this.history.length <= 1;
  }

  @computed get redoDisabled() {
    return this.historyIndex >= this.history.length - 1;
  }

  constructor(slides) {
    if (slides) {
      this.history = Immutable.from([slides]);
    }
  }

  dropElement(elementType) {
    const slideToAddTo = this.currentSlide;
    const newSlidesArray = this.slides;

    // TODO: Convert to a porper element add.
    slideToAddTo.children.push(elementType);
    newSlidesArray[this.currentSlideIndex] = slideToAddTo;

    this._addToHistory(newSlidesArray);
  }

  // setSelectedSlide(slideId) {
  //   this.currentSlideIndex = findIndex(this.slides, (slide) => slide.id === slideId);
  // }

  moveSlide(currentIndex, newIndex) {
    const slidesArray = this.slides;

    slidesArray.splice(newIndex, 0, slidesArray.splice(currentIndex, 1)[0]);

    transaction(() => {
      this.currentSlideIndex = newIndex;
      this._addToHistory(slidesArray);
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

  _addToHistory(newSlides) {
    // Only notify observers once all expressions have completed
    transaction(() => {
      // Wrapp the new slides array in an array so they aren't concatted as individual slide objects
      this.history = this.history.concat([Immutable.from(newSlides)]);
      this.historyIndex += 1;
    });
  }
}
