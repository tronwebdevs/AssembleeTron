import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import App from "./components/App";

ReactGA.initialize("UA-117513834-3");

ReactDOM.render(<App />, document.getElementById("root"));
