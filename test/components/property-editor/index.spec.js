import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import PropertyEditor from "../../../app/components/property-editor";

describe("PropertyEditor", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <PropertyEditor />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
