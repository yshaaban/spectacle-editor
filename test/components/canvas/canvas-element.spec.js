import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { sandbox } from "sinon";

import CanvasElement from "../../../app/components/canvas/canvas-element";

describe("CanvasElement", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });


  it("should render", () => {
    const wrapper = shallow(<CanvasElement />);

    expect(wrapper).to.be.ok;
  });
});
