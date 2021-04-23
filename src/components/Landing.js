import React, { Component } from "react";

import Logo from "../logo_1.png";
import "../style/landing.css";
export default class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <img src={Logo} />
        <h3>
          {" "}
          <span> Welcome to my App </span>
          <div className="animation"> </div>
        </h3>
      </div>
    );
  }
}
