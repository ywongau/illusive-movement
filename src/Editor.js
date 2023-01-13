import React, { useState } from "react";
import IllusiveText from "./IllusiveText";

const Editor = ({ defaultText }) => {
  const params = new URLSearchParams(window.location.hash.replace("#", ""));
  const [textInput, setTextInput] = useState(
    params.get("text") || (defaultText ?? "")
  );
  const [mode, setMode] = useState(params.get("mode") || "random");
  const [isSpaceless, setIsSpaceless] = useState(
    params.get("spaceless") === "true"
  );
  const changeHandler = (event) => {
    setTextInput(event.target.value);
  };
  const clickHandler = () => {
    const url =
      window.location.origin +
      window.location.pathname +
      `#mode=${mode}&spaceless=${isSpaceless}&text=` +
      encodeURIComponent(textInput);
    navigator.clipboard.writeText(url);
  };
  const changeOption = (event) => {
    setMode(event.target.value);
  };

  const checkHandler = (event) => {
    setIsSpaceless(event.target.checked);
  };

  return (
    <div className="Editor">
      <label htmlFor="s1">Mode</label>
      <select id="s1" onChange={changeOption} value={mode}>
        <option value="random">Random</option>
        <option value="interweaving">Interweaving</option>
      </select>
      <label>
        <input type="checkbox" onChange={checkHandler} checked={isSpaceless} />
        Spaceless
      </label>

      <textarea
        defaultValue={textInput}
        onChange={changeHandler}
        aria-label="Input"
      />
      <button onClick={clickHandler} disabled={!textInput}>
        Share
      </button>
      <IllusiveText text={textInput} mode={mode} spaceless={isSpaceless} />
    </div>
  );
};

export default Editor;
