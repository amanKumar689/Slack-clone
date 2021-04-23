import React, { Component } from "react";
import "../style/Header.css";
import Logo from "../logo_1.png";
import { InfoContext } from "./reducer";
import Avatar from "@material-ui/core/Avatar";
import { Auth } from "../config/config";
import { withRouter } from "react-router-dom";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutShow: false,
    };
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  //Logout handler

  logoutHandler() {
    const [state, dispatch] = this.context;
    Auth.signOut()
      .then(() => {
        // Sign-out successful.

        dispatch({
          type: "SET_USERNAME",
          username: false,
          imageUrl: null,
        });
        dispatch({
          type: "SET_ROOM_NAME",
          roomName: "No Room Selected",
        });
        this.props.history.push("/signup");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  render() {
    return (
      <div className="Header">
        <div className="logo">
          {" "}
          <img src={Logo} id="logo_img" alt="" />
          <Avatar
            alt={this.context[0].username}
            className={"Auth_logo"}
            src={
              this.context[0].imageUrl == null ? "/" : this.context[0].imageUrl
            }
            onClick={() => {
              this.setState({
                ...this.state,
                logoutShow: !this.state.logoutShow,
              });
            }}
          />
          <nav
            style={
              this.state.logoutShow ? { display: "block" } : { display: "none" }
            }
            onClick={this.logoutHandler}
          >
            Log out
          </nav>
        </div>
      </div>
    );
  }
}

Header.contextType = InfoContext;

export default withRouter(Header);
