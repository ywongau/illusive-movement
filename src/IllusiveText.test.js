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
    render(<Component mode="random" {...props} />);

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
    // screen.debug();
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
      mode: "interweaving",
    });
    expect(screen.getByText("One").className).to.equal("ne");
    expect(screen.getByText("Two").className).to.equal("ne");

    expect(screen.getByText("Three").className).to.equal("sw");
    expect(screen.getByText("Four").className).to.equal("sw");

    expect(screen.getByText("Five").className).to.equal("ne");
    expect(screen.getByText("Six").className).to.equal("ne");
  });

  it("should replace line break in text input to <br>", () => {
    renderComponent({ text: "One\ntwo" });
    const ele = screen.getByText("One");
    expect(ele.nextElementSibling.tagName).to.equal("BR");
  });

  it("should not have an extra empty space at the end", async () => {
    renderComponent({ text: "One" });
    expect(screen.getByText("One").nextSibling).to.equal(null);
  });

  it("should split every character if spaceless is set to true", () => {
    renderComponent({ text: "这是", spaceless: true });
    screen.getByText("这");
  });

  it("should render spaceless text correctly when switched from non-spaceless mode", () => {
    const { rerender } = renderComponent({ text: "联合国", spaceless: false });
    rerender(<Component mode="random" text="联合国" spaceless={true} />);
    expect(screen.getByText("合").className).to.equal("ne");
  });
});
