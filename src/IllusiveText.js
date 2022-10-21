import React from "react";
const classArray = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const IllusiveText = ({ text }) => {
  const words = text.split(/\s+/g);
  return (
    <div className="IllusiveText">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span className={classArray[index % 8]}>{word}</span>
          &nbsp;
        </React.Fragment>
      ))}
    </div>
  );
};

export default IllusiveText;
