import React, { useState } from "react";
import IllusiveText from "./IllusiveText";

const Editor = ({ defaultText }) => {
  const [textInput, setTextInput] = useState(defaultText ?? "");
  const [mode, setMode] = useState(defaultText ?? "Random");
  const changeHandler = (event) => {
    setTextInput(event.target.value);
  };
  const changeOption = (event) => {
    setMode(event.target.value);
    console.log(event.target.value);
  };
  return (
    <div className="Editor">
      <label for="s1">Mode</label>
      <select id="s1" onChange={changeOption}>
        <option value="Random">Random</option>
        <option value="Interweaving">Interweaving</option>
      </select>
      <textarea
        defaultValue={textInput}
        onChange={changeHandler}
        aria-label="Input"
      />
      <IllusiveText text={textInput} mode={mode} />
    </div>
  );
};

export default Editor;
