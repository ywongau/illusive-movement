import React, { useEffect, useRef } from "react";
const classArray = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const IllusiveText = ({ text, mode, spaceless }) => {
  const words = text.split(spaceless ? "" : /[\t ]+/g);
  const container = useRef();
  useEffect(() => {
    const allSpans = [...container.current.querySelectorAll("span")];
    let lastY = null;
    let className = null;
    allSpans.forEach((span, index) => {
      if (mode === "interweaving") {
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
  }, [mode, text, spaceless]);
  return (
    <div className="IllusiveText" ref={container}>
      {words.map((word, index) => {
        const eles = word.split("\n");
        return (
          <React.Fragment key={index}>
            {eles.map((ele, index) => {
              return index === eles.length - 1 ? (
                <span>{ele}</span>
              ) : (
                <>
                  <span>{ele}</span>
                  <br />
                </>
              );
            })}
            {index === words.length - 1 ? null : " "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default IllusiveText;
