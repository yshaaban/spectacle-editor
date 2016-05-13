import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
// import { sandbox } from "sinon";

import CanvasElement from "../../../app/components/canvas/canvas-element";

describe("CanvasElement", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });


  it("shouldn't render without the required props", () => {
    expect(shallow.bind(
      null,
      <CanvasElement />
    )).to.throw();
  });
});
