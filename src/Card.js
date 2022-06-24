import React, { useEffect, useState } from "react";
import Note from "./Note";
import midiService from "./midiService";
import logService from "./logService";
const Card = ({ note }) => {
  const [isCorrect, setIsCorrect] = useState();
  const [startTime] = useState(new window.Date());
  useEffect(() => {
    midiService.onNoteOn((actualNote) => {
      const correctness = actualNote === note;
      setIsCorrect(correctness);
      const now = window.Date.now();
      logService.log({
        note: actualNote,
        correct: correctness,
        duration: now - startTime,
        timestamp: now,
      });
    });
  }, [note, startTime]);

  return (
    <div>
      <Note note={note} />
      {isCorrect !== undefined && (
        <div> {isCorrect ? "Correct" : "Incorrect"}</div>
      )}
    </div>
  );
};

export default Card;
