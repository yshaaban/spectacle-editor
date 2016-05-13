import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import SlideMenu from "../../../app/components/canvas/slide";

describe("SlideMenu", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("shouldn't render without the required props and context", () => {
    expect(shallow.bind(
      null,
      <SlideMenu />
    )).to.throw();
  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <SlideMenu />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
