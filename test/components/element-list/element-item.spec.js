import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import ElementItem from "../../../app/components/element-list/element-item";

describe("ElementItem", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <ElementItem />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
