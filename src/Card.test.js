import React from "react";
import sinon from "sinon";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import rewiremock from "rewiremock/node";
import { click } from "@testing-library/user-event/dist/click";
const Note = sinon.spy(({ note }) => <div>{note}</div>);
const midiService = { onNoteOn: sinon.spy() };
const logService = { log: sinon.spy() };

const Card = rewiremock.proxy(
  () => require("./Card"),
  () => {
    rewiremock(() => require("./Note")).withDefault(Note);
    rewiremock(() => require("./midiService")).withDefault(midiService);
    rewiremock(() => require("./logService")).withDefault(logService);
  }
).default;

describe("Card", () => {
  let clock;

  beforeEach(() => {
    const config = {
      global: window,
      now: new Date(2022, 2, 2, 2, 2, 2),
    };
    clock = sinon.useFakeTimers(config);
  });

  afterEach(async () => {
    clock.restore();
    sinon.resetHistory();
    await cleanup();
  });

  it("should work", async () => {
    render(<Card note="C4" />);
    screen.getByText("C4");
    sinon.assert.calledWith(Note, { note: "C4" });
  });

  const noteOn = (note) => {
    const callback = midiService.onNoteOn.lastCall.args[0];
    callback(note);
  };

  it("should show the word 'correct' if user presses the correct key", async () => {
    render(<Card note="C4" />);

    sinon.assert.called(midiService.onNoteOn);
    noteOn("C4");
    await screen.findByText("Correct");
  });

  it("should show the word 'incorrect' if user presses the wrong key", async () => {
    render(<Card note="C4" />);
    sinon.assert.called(midiService.onNoteOn);
    noteOn("D4");
    await screen.findByText("Incorrect");
  });

  it("should log the test result", () => {
    render(<Card note="C4" />);
    clock.tick(2000);
    noteOn("D4");
    sinon.assert.calledWith(logService.log, {
      note: "D4",
      correct: false,
      duration: 2000,
      timestamp: new Date(2022, 2, 2, 2, 2, 4).valueOf(),
    });
  });
});
