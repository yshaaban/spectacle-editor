import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";

import Home from "../../../app/containers/home";
import HistoryMenu from "../../../app/components/history-menu";

describe("HistoryMenu", () => {
  beforeEach(() => {

  });

  afterEach(() => {

  });

  it("shouldn't render without the required props and context", () => {
    expect(shallow.bind(
      null,
      <HistoryMenu />
    )).to.throw();
  });

  it("should render", () => {
    const wrapper = mount(
      <Home>
        <HistoryMenu />
      </Home>
    );

    expect(wrapper).to.be.ok;
  });
});
