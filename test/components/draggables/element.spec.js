import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import Element from "../../../app/components/draggables/element";

describe("Element", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("shouldn't render without the required props and context", () => {
    expect(shallow.bind(
      null,
      <Element />
    )).to.throw();
  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <Element />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
