import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import CanvasElement from "../../../app/components/canvas/canvas-element";
import elements from "../../../app/elements";
import { ElementTypes } from "../../../app/constants";

const defaultComponent = elements[ElementTypes.TEXT];

describe("CanvasElement", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("shouldn't render without the required props and context", () => {
    expect(shallow.bind(
      null,
      <CanvasElement />
    )).to.throw();
  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <CanvasElement component={defaultComponent} />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
