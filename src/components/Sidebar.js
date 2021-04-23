import React, { Component } from "react";
import "../style/sidebar.css";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { db } from "../config/config";
import { withRouter } from "react-router-dom";
import firebase from "firebase";
import { InfoContext } from "./reducer";
import CloseIcon from "@material-ui/icons/Close";
class Sidebar extends Component {
  constructor(props) {
    super(props);

    // This state manage Dialog pop up and channelList that is fetched from database
    this.state = {
      open: false,
      channelList: [],
      TempRoomName: null,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.roomNameHandler = this.roomNameHandler.bind(this);
    this.channelHandler = this.channelHandler.bind(this);
  }

  //Let's Fetch Channel List

  componentDidMount(prevprops) {
    db.collection("rooms").onSnapshot((snap) => {
      const List = [];
      snap.forEach(({ id }) => {
        List.push(id);
      });
      this.setState({ ...this.state, channelList: List });
    });
  }

  // Set Channel to  Store

  componentDidUpdate(prevProps, prevState) {
    if (prevState.channelList != this.state.channelList) {
      const [state, dispatch] = this.context;
      dispatch({
        type: "SET_CHANNELS",
        channels: this.state.channelList,
      });
    }
  }

  handleClickOpen = () => {
    this.setState({ ...this.state, open: true });
  };

  // After click on create button

  handleClose = (event) => {
    if (event.currentTarget.id === "create") {
      const df = db.collection("rooms").doc(this.state.TempRoomName);
      df.set({ desc: "about channel " });
      df.collection("MessagesDetail")
        .doc("Startup_message")
        .set({
          message: "welcome to this channel",
          timeAtcreated: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }
    this.setState({ ...this.state, open: false });
  };

  roomNameHandler(event) {
    this.setState({ ...this.state, TempRoomName: event.target.value });
  }

  channelHandler(event) {
    this.props.history.push(`/home?room=${event.target.id}`);
  }

  render() {
    return (
      <div className={`sidebar ${this.context[0].CurrentClass}`}>
        {this.context[0].CloseBtn && (
          <span
            style={{
              position: "absolute",
              top: "20px",
              right: "40px",
              cursor: "pointer",
            }}
            onClick={() => {
              const dispatch = this.context[1];
              dispatch({
                type: "SET_CURRENT_CLASS",
                val: "close",
                CloseBtn: true,
                menuBtn: true,
              });
            }}
          >
            <CloseIcon />
          </span>
        )}
        <div className="sidebar_header">{this.context[0].username}</div>
        <div className="sidebar_body">
          {/* channel Name + Add Channel  */}
          <p>
            Channels &nbsp; <ArrowDropDownIcon />
          </p>
          <ul>
            {this.state.channelList.length != 0 &&
              this.state.channelList.map((channel, index) => {
                return (
                  <li key={index} id={channel} onClick={this.channelHandler}>
                    # {channel}
                  </li>
                );
              })}
            <li>
              <Button
                variant="text"
                style={{ color: "inherit", textTransform: "initial" }}
                onClick={this.handleClickOpen}
              >
                Add a channel <AddIcon style={{ right: "-40px", top: "7px" }} />
              </Button>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
              >
                <DialogTitle id="form-dialog-title">Create</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    &nbsp; please do not create rooms for ads or spams be gentle
                    &nbsp;&nbsp;&nbsp;
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Room name"
                    type="text"
                    fullWidth
                    onChange={this.roomNameHandler}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                    id="create"
                    onClick={this.handleClose}
                    color="primary"
                  >
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </li>
          </ul>
          <div className="channel_list">
            <div className="addChannels"></div>
          </div>
        </div>
      </div>
    );
  }
}

Sidebar.contextType = InfoContext;

export default withRouter(Sidebar);
