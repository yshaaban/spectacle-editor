import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import Slide from "../../../app/components/canvas/slide";

describe("Slide", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("shouldn't render without the required props and context", () => {
    expect(shallow.bind(
      null,
      <Slide />
    )).to.throw();
  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <Slide />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
