import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import ElementList from "../../../app/components/element-list";

describe("ElementList", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <ElementList />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
