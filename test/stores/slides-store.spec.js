import { expect } from "chai";
import { sandbox } from "sinon";
import { autorun } from "mobx";

import SlidesStore from "../../app/stores/slides-store";

let slideStore;

describe("SlidesStore", () => {
  beforeEach(() => {
    slideStore = new SlidesStore();
  });

  afterEach(() => {

  });

  it("should initialize with correct data", () => {
    expect(slideStore.history.length).to.equal(1);
    expect(slideStore.historyIndex).to.equal(0);
    expect(slideStore.currentSlideIndex).to.equal(0);
    expect(slideStore.currentElementIndex).to.equal(null);
    expect(slideStore.currentElement).to.equal(null);
    expect(slideStore.undoDisabled).to.equal(true);
    expect(slideStore.redoDisabled).to.equal(true);

    const slides = slideStore.slides;
    const currentSlide = slideStore.currentSlide;

    expect(slides.length).to.equal(5);
    expect(slides[0]).to.eql(currentSlide);
  });
});
