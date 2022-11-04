import React from "react";
import { cleanup, fireEvent, screen, render } from "@testing-library/react";
import rewiremock from "rewiremock";
import sinon from "sinon";
describe("Editor", () => {
  afterEach(async () => {
    await cleanup();
  });

  const IllusiveText = sinon.spy(() => <div>Fake illusive text</div>);

  const Component = rewiremock.proxy(
    () => require("./Editor"),
    () => {
      rewiremock(() => require("./IllusiveText")).withDefault(IllusiveText);
    }
  ).default;

  const renderComponent = (props) => render(<Component {...props} />);

  it("should pass empty string as the initial text", () => {
    renderComponent();
    sinon.assert.calledWith(IllusiveText, sinon.match({ text: "", mode:'Random' }));
  });

  it("should show default text if provided", () => {
    renderComponent({ defaultText: "banana" });
    sinon.assert.calledWith(IllusiveText, sinon.match({ text: "banana" }));
    screen.getByDisplayValue("banana");
  });

  it("should show a text area with a button", () => {
    renderComponent();
    const text = "One two three";
    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value: text },
    });
    screen.getByText("Fake illusive text");
    sinon.assert.calledWith(IllusiveText, sinon.match({ text }));
  });

  it("should show a select for different modes", () => {
    renderComponent();

    screen.getByLabelText("Mode");
    screen.getByDisplayValue("Random"); //Interweaving
    fireEvent.change(screen.getByLabelText("Mode"), {
      target: { value: "Interweaving" },
    });
    screen.getByDisplayValue("Interweaving");
    sinon.assert.calledWith(
      IllusiveText,
      sinon.match({ mode: "Interweaving" })
    );
  });
});
