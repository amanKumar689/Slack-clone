import React, { Component } from "react";
import "../style/chat.css";
import SendIcon from "@material-ui/icons/Send";
import firebase from "firebase";
import { db } from "../config/config";
import { InfoContext } from "./reducer";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from "@material-ui/icons/Menu";
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageBox: "",
      Mobile_Version: false,
      menuShow: false,
    };
    this.messageStoreHandler = this.messageStoreHandler.bind(this);
    this.sendMessageHandler = this.sendMessageHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }
  deleteHandler() {
    db.collection("rooms")
      .doc(this.context[0].user.uid)
      .collection("roomManage")
      .doc(this.context[0].roomId)
      .delete()
      .then(() => {
        const dispatch = this.context[1];
        dispatch({
          type: "alert_model",
          message: "Deleted succesfully",
          Message_type: "success",
          open: true,
        });
        dispatch({
          type: "SET_ROOM_NAME",
          roomName: "No Room Selected",
        });
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  messageStoreHandler(event) {
    this.setState({ ...this.state, messageBox: event.target.value });
  }

  sendMessageHandler() {
    // Sending Message along with inforamtion to firebase's Firestore
    const [state, dispatch] = this.context;
    this.Msg = this.state.messageBox;
    this.setState({ ...this.state, messageBox: "" });
    if (this.props.roomName != "No Room Selected") {
      db.collection("rooms")
        .doc(state.user.uid)
        .collection("roomManage")
        .doc(state.roomId)
        .collection("messages")
        .add({
          imageUrl: this.context[0].imageUrl,
          message: this.Msg,
          timeAtcreated: firebase.firestore.FieldValue.serverTimestamp(),
          username: this.context[0].username,
        })
        .then(() => {
          const chatBox = document.getElementsByClassName("chatBox_message")[0];
          if (chatBox != undefined) {
            setTimeout(() => {
              chatBox.scrollTop = chatBox.scrollTop + 100;
            }, 500);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  componentDidUpdate(prevState, prevProps) {
    const Each_msg = document.getElementsByClassName("chatBox_messasge_box")[0];

    if (Each_msg != undefined) {
      Each_msg.style.minWidth = `${window.innerWidth}px`;
    } //
  }

  Mobile_Version_Checker(state, dispatch) {
    if (window.innerWidth <= 650 && state?.CurrentClass != "close") {
      dispatch({
        type: "SET_CURRENT_CLASS",
        val: "close",
        CloseBtn: true,
        menuBtn: true,
      });
      this.setState({ ...this.state, Mobile_Version: true });
    } else if (window.innerWidth >= 650 && state?.CurrentClass != "open") {
      dispatch({
        type: "SET_CURRENT_CLASS",
        val: "open",
        CloseBtn: false,
        menuBtn: false,
      });
      this.setState({ ...this.state, Mobile_Version: false });
    }
  }
  componentDidMount() {
    const [state, dispatch] = this.context;
    if (state != undefined) {
      window.onresize = () => {
        this.Mobile_Version_Checker(state, dispatch);
      };
      this.Mobile_Version_Checker(state, dispatch);
    }

    //  Each_msg.style.minWidth = window.innerWidth
  }

  render() {
    const [state, dispatch] = this.context;
    return (
      <div className="chatBox">
        <div className="chatBox_message">
          <div className="chatBox_header">
            <p>
              {this.context[0].menuBtn && (
                <MenuIcon
                  className={"menu"}
                  onClick={() => {
                    this.setState({
                      ...this.state,
                      menuShow: !this.state.menuShow,
                    });
                    const dispatch = this.context[1];
                    dispatch({
                      type: "SET_CURRENT_CLASS",
                      val: "open",
                      CloseBtn: true,
                      menuBtn: false,
                    });
                  }}
                />
              )}
              <span> # {this.context[0].CurrentRoomName}</span>
            </p>

            {state.CurrentRoomName != "No Room Selected" && (
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "5px 10px 5px 20px" }}
                id={this.state.Mobile_Version ? "DelBtn" : undefined}
                startIcon={
                  <DeleteIcon
                    style={
                      !this.state.Mobile_Version
                        ? { marginTop: "8px", left: "2px", top: "-1px" }
                        : { marginTop: "8px", left: "4px", top: "-5px" }
                    }
                  />
                }
                onClick={this.deleteHandler}
              >
                {!this.context[0].menuBtn && <span> Delete </span>}
              </Button>
            )}
          </div>
          {state.CurrentRoomName != "No Room Selected" &&
            (this.context[0].channelList.findIndex(
              (channel) => channel === this.context[0].CurrentRoomName
            ) >= 0 ? (
              <div className="chatBox_messasge_box">
                {this.context[0].MessageStore != null &&
                  this.context[0].MessageStore.map(
                    ({ message, username, imageUrl }, index) => {
                      return (
                        <p key={`m` + index} className="message_width_adjust">
                          <span>
                            {index != 0 && (
                              <Avatar alt={username} src={imageUrl} />
                            )}
                            &nbsp;&nbsp;&nbsp; <span> {username}</span>
                          </span>
                          <br />
                          {message}
                        </p>
                      );
                    }
                  )}
              </div>
            ) : (
              <h2 className="deleted"> Room Deleted !!</h2>
            ))}
        </div>
        <div className="chatBox_input">
          {state.CurrentRoomName != "No Room Selected" && (
            <div className="chatBox_input_box">
              <input
                type="text"
                placeholder={"Send Message to this channel"}
                value={this.state.messageBox}
                onChange={this.messageStoreHandler}
                onKeyPress={(e) => {
                  e.key === "Enter" && this.sendMessageHandler();
                }}
              />

              <SendIcon
                className={"send"}
                fontSize={"small"}
                onClick={this.sendMessageHandler}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Chat.contextType = InfoContext;

export default Chat;
