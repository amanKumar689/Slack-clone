import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";
import authHandler from "../config/config";
import { withRouter } from "react-router-dom";

import google from "../google.svg";
import reducer, { InfoContext, intialState, MyInfo } from "./reducer";
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      type: "signup",
    };
    this.Fill_up_handler = this.Fill_up_handler.bind(this);
  }

  componentDidMount(prevProps) {}

  Fill_up_handler(e) {
    e.target.id === "email"
      ? this.setState({ ...this.state, email: e.target.value })
      : this.setState({ ...this.state, password: e.target.value });
  }

  render() {
    const [state, dispatch] = this.context;
    return (
      <div className="login">
        <input
          id="email"
          type="email"
          autoComplete="off"
          placeholder="email"
          id="email"
          onChange={this.Fill_up_handler}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={this.Fill_up_handler}
        />
        <input
          type="submit"
          value="Sign up"
          id="submit"
          onClick={() => {
            authHandler(this.state)
              .then((user) => {
                dispatch({
                  type: "alert_model",
                  message: "Successfully signed up !!!!",
                  Message_type: "success",
                  open: true,
                });
                let username = user.user.email.split("@").slice(0, 1);

                dispatch({
                  type: "SET_USERNAME",
                  username: username[0],
                  imageUrl: user.user.photoURL,
                });
                this.props.history.push("/home");
              })
              .catch((err) => {
                dispatch({
                  type: "alert_model",
                  message: err.message,
                  Message_type: "error",
                  open: true,
                });
              });
          }}
        />
        <Link to="/login">Login </Link>
        <div className="google">
          <img
            src={google}
            alt=""
            id={"google"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              authHandler({ type: "google" }).then((user) => {
                dispatch({
                  type: "alert_model",
                  message: "Successfully logged in  !!!!",
                  Message_type: "success",
                  open: true,
                });
                let username = user.user.email.split("@").slice(0, 1);
                dispatch({
                  type: "SET_USERNAME",
                  username: username[0],
                  imageUrl: user.user.photoURL,
                });

                this.props.history.push("/home");
              });
            }}
          />
        </div>
      </div>
    );
  }
}

Signup.contextType = InfoContext;
export default withRouter(Signup);
