import { expect } from "chai";
import { sandbox } from "sinon";
import { autorun } from "mobx";

import SlidesStore from "../../app/stores/slides-store";

let slideStore;
let boxOfSand;
let historySpy;
let historyIndexSpy;
let currentSlideSpy;
let currentSlideIndexSpy;
let slidesSpy;
let currentElementSpy;
let currentElementIndexSpy;
let undoDisabledSpy;
let redoDisabledSpy;

const disposers = [];

describe("SlidesStore", () => {
  beforeEach(() => {
    boxOfSand = sandbox.create();
    slideStore = new SlidesStore();

    historySpy = boxOfSand.spy();
    historyIndexSpy = boxOfSand.spy();
    currentSlideSpy = boxOfSand.spy();
    currentSlideIndexSpy = boxOfSand.spy();
    slidesSpy = boxOfSand.spy();
    currentElementSpy = boxOfSand.spy();
    currentElementIndexSpy = boxOfSand.spy();
    undoDisabledSpy = boxOfSand.spy();
    redoDisabledSpy = boxOfSand.spy();

    disposers.push(autorun(() => {
      historySpy(slideStore.history);
    }));

    disposers.push(autorun(() => {
      historyIndexSpy(slideStore.historyIndex);
    }));

    disposers.push(autorun(() => {
      currentSlideSpy(slideStore.currentSlide);
    }));

    disposers.push(autorun(() => {
      currentSlideIndexSpy(slideStore.currentSlideIndex);
    }));

    disposers.push(autorun(() => {
      slidesSpy(slideStore.slides);
    }));

    disposers.push(autorun(() => {
      currentElementSpy(slideStore.currentElement);
    }));

    disposers.push(autorun(() => {
      currentElementIndexSpy(slideStore.currentElementIndex);
    }));

    disposers.push(autorun(() => {
      undoDisabledSpy(slideStore.undoDisabled);
    }));

    disposers.push(autorun(() => {
      redoDisabledSpy(slideStore.redoDisabled);
    }));
  });

  afterEach(() => {
    slideStore = null;

    disposers.forEach((dispose) => {
      dispose();
    });

    boxOfSand.restore();
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

    expect(historySpy).to.not.have.been.called;
    expect(historyIndexSpy).to.not.have.been.called;
    expect(currentSlideSpy).to.not.have.been.called;
    expect(currentSlideIndexSpy).to.not.have.been.called;
    expect(slidesSpy).to.not.have.been.called;
    expect(currentElementSpy).to.not.have.been.called;
    expect(currentElementIndexSpy).to.not.have.been.called;
    expect(undoDisabledSpy).to.not.have.been.called;
    expect(redoDisabledSpy).to.not.have.been.called;
  });
});
