import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import reducer, { InfoContext, intialState, MyInfo } from "./components/reducer";
ReactDOM.render(
  <React.StrictMode>
    <MyInfo reducer={reducer} intialState={intialState}>
      <App />
    </MyInfo>
  </React.StrictMode>,
  document.getElementById("root")
);
