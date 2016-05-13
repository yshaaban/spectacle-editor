import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";

import Home from "../../app/containers/home";

describe("Home", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("should render", () => {
    const wrapper = mount(
      <Home />
    );

    expect(wrapper).to.be.ok;
  });
});
