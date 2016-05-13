import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Provider from "../../../app/components/utils/provider";

describe("Provider", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("shouldn't render without the required props and context", () => {
    expect(shallow.bind(
      null,
      <Provider />
    )).to.throw();
  });

  it("should render", () => {
    const wrapper = mount(
      <Provider><div>stuff</div></Provider>
    );

    expect(wrapper).to.be.ok;
  });
});
