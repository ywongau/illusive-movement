import React from "react";
import { cleanup, screen, render } from "@testing-library/react";
import rewiremock from "rewiremock";
import { expect } from "chai";
describe("IllusiveText", () => {
  afterEach(async () => {
    await cleanup();
  });

  const Component = rewiremock.proxy(() => require("./IllusiveText")).default;

  const renderComponent = (props) => render(<Component {...props} />);

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
});
