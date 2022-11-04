import React from "react";
import { cleanup, screen, render } from "@testing-library/react";
import rewiremock from "rewiremock";
import { expect } from "chai";
import sinon from "sinon";
describe("IllusiveText", () => {
  beforeEach(() => {
    sinon.stub(Element.prototype, "getBoundingClientRect").returns({ y: 0 });
  });
  afterEach(async () => {
    Element.prototype.getBoundingClientRect.restore();
    await cleanup();
  });

  const Component = rewiremock.proxy(() => require("./IllusiveText")).default;

  const renderComponent = (props) =>
    render(<Component mode="Random" {...props} />);

  // give text: 'One two three'
  // renders <span>One</span> <span>two</span> <span>three</span>
  it("should show text", () => {
    renderComponent({ text: "One" });
    screen.getByText("One");
  });

  it("should show each word inside a span", () => {
    renderComponent({ text: "One Two\tThree\nFour" });
    screen.getByText("One");
    screen.getByText("Two");
    screen.getByText("Three");
  });

  // n ne e se s sw w nw
  it("should assign class names to each word for rotating directions", () => {
    renderComponent({ text: "One Two Three Four Five Six Seven Eight Nine" });
    expect(screen.getByText("One").className).to.equal("n");
    expect(screen.getByText("Two").className).to.equal("ne");
    expect(screen.getByText("Nine").className).to.equal("n");
  });

  it("should give words on odd rows ne and those on even rows sw when mode is Interweaving", () => {
    const getBoundingClientRect = Element.prototype.getBoundingClientRect;
    getBoundingClientRect
      .onCall(2)
      .returns({ y: 20 })
      .onCall(3)
      .returns({ y: 20 })
      .onCall(4)
      .returns({ y: 40 })
      .onCall(5)
      .returns({ y: 40 });
    renderComponent({
      text: "One Two Three Four Five Six",
      mode: "Interweaving",
    });
    expect(screen.getByText("One").className).to.equal("ne");
    expect(screen.getByText("Two").className).to.equal("ne");

    expect(screen.getByText("Three").className).to.equal("sw");
    expect(screen.getByText("Four").className).to.equal("sw");

    expect(screen.getByText("Five").className).to.equal("ne");
    expect(screen.getByText("Six").className).to.equal("ne");
  });
});
