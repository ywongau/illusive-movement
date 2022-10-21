import React from "react";
import "./App.scss";
import Editor from "./Editor";
const sampleText = `Australian satirical newspaper and podcast The Betoota Advocate (TBA) is heading to Broken Hill to run a podcast workshop aimed at encouraging the involvement of regional youth in media.
The publication, which named itself after the deserted town of Betoota in central-west Queensland, called itself "Australia's oldest newspaper" and has published several stories about Broken Hill.
The program held this weekend is designed for people aged 16-30 who want to build their skills in radio.
`;
function App() {
  return (
    <div className="App">
      <Editor defaultText={sampleText} />
    </div>
  );
}

export default App;
