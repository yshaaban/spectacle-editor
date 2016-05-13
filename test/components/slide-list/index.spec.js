import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import SlideList from "../../../app/components/slide-list";

describe("SlideList", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("shouldn't render without the required props and context", () => {
    expect(shallow.bind(
      null,
      <SlideList />
    )).to.throw();
  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <SlideList />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
