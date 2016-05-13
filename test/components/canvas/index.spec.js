import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import Canvas from "../../../app/components/canvas";

describe("Canvas", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <Canvas />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
