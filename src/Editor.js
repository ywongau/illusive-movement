import React, { useState } from "react";
import IllusiveText from "./IllusiveText";

const Editor = ({ defaultText }) => {
  const [textInput, setTextInput] = useState(defaultText ?? "");
  const changeHandler = (event) => {
    setTextInput(event.target.value);
  };
  return (
    <div className="Editor">
      <textarea
        defaultValue={textInput}
        onChange={changeHandler}
        aria-label="Input"
      />
      <IllusiveText text={textInput} />
    </div>
  );
};

export default Editor;
