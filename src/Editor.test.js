import React from "react";
import {
  cleanup,
  fireEvent,
  screen,
  render,
  act,
} from "@testing-library/react";
import rewiremock from "rewiremock";
import sinon from "sinon";
import { expect } from "chai";
describe("Editor", () => {
  beforeEach(() => {
    navigator.clipboard = {
      writeText: sinon.spy(),
    };
  });

  afterEach(async () => {
    await cleanup();
    delete navigator.clipboard;
    window.location.hash = "#";
    sinon.resetHistory();
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
    sinon.assert.calledWith(
      IllusiveText,
      sinon.match({ text: "", mode: "random" })
    );
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
      target: { value: "interweaving" },
    });
    screen.getByDisplayValue("Interweaving");
    sinon.assert.calledWith(
      IllusiveText,
      sinon.match({ mode: "interweaving" })
    );
  });

  it("should have a share button that saves a link to clipboard on click", async () => {
    renderComponent();
    const text = "One two three";
    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value: text },
    });
    fireEvent.click(screen.getByLabelText("Spaceless"));
    fireEvent.click(screen.getByText("Share"));
    const expectedUrl =
      window.location.href +
      "mode=random&spaceless=true&text=" +
      encodeURIComponent(text);
    sinon.assert.calledWith(navigator.clipboard.writeText, expectedUrl);
  });

  it("should not enable share button when no text", async () => {
    renderComponent();
    expect(screen.getByText("Share").disabled).to.equal(true);
  });

  it("should not set input text to an empty string if text in hash is not defined", async () => {
    window.location.hash = "";
    await act(() => {
      renderComponent({ defaultText: "banana" });
    });
    expect(() =>
      sinon.assert.calledWith(IllusiveText, sinon.match({ text: "" }))
    ).to.throw();
  });

  it("should not show default value in textbox if hash is defined", async () => {
    window.location.hash =
      "#mode=interweaving&spaceless=true&text=" +
      encodeURIComponent("One two three");
    await act(() => {
      renderComponent({ defaultText: "banana" });
    });
    screen.getByDisplayValue("One two three");
    screen.getByDisplayValue("Interweaving");
    expect(screen.getByLabelText("Spaceless").checked).to.equal(true);
  });

  it("should make sure spaceless=false when checkbox is unchecked spaceless=true in hash", async () => {
    window.location.hash =
      "#mode=interweaving&spaceless=true&text=" +
      encodeURIComponent("One two three");
    await act(() => {
      renderComponent();
    });
    const spaceless = screen.getByLabelText("Spaceless");

    expect(spaceless.checked).to.equal(true);
    fireEvent.click(spaceless);

    await act(() => {
      fireEvent.click(screen.getByText("Share"));
    });

    const params = new URLSearchParams(
      navigator.clipboard.writeText.args[0][0]
    );
    expect(params.get("spaceless")).to.equal("false");
  });

  it("should treat the string 'false' in hash as false", async () => {
    window.location.hash =
      "#mode=interweaving&spaceless=false&text=" +
      encodeURIComponent("One two three");
    await act(() => {
      renderComponent({ defaultText: "banana" });
    });
    expect(screen.getByLabelText("Spaceless").checked).to.equal(false);
  });

  it("should have a checkbox to indicate wheather the language used is spaceless", async () => {
    renderComponent({ defaultText: "这是" });

    await act(() => {
      fireEvent.click(screen.getByLabelText("Spaceless"));
    });
    sinon.assert.calledWith(IllusiveText, sinon.match({ spaceless: true }));
  });
});
