import React, { useEffect, useRef } from "react";
const classArray = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const IllusiveText = ({ text, mode }) => {
  const words = text.split(/\s+/g);
  const container = useRef();
  useEffect(() => {
    const allSpans = [...container.current.querySelectorAll("span")];
    let lastY = null;
    let className = null;
    allSpans.forEach((span, index) => {
      if (mode === "Interweaving") {
        const y = span.getBoundingClientRect().y;
        if (y !== lastY) {
          lastY = y;
          className = className === "ne" ? "sw" : "ne";
        }
        span.className = className;
      } else {
        span.className = classArray[index % 8];
      }
    });
  }, [mode]);
  return (
    <div className="IllusiveText" ref={container}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span>{word}</span>
          &nbsp;
        </React.Fragment>
      ))}
    </div>
  );
};

export default IllusiveText;
