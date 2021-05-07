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
import { db, authState } from "../config/config";
import { withRouter } from "react-router-dom";
import { InfoContext } from "./reducer";
import CloseIcon from "@material-ui/icons/Close";
import room_list from "./smallComp/room_list";
import room_create from "./smallComp/room_create";
class Sidebar extends Component {
  constructor(props) {
    super(props);

    // This state manage Dialog pop up and channelList that is fetched from database
    this.state = {
      createOpen: false,
      joinOpen: false,
      TempRoomName: null,
    };
    this.setState = this.setState.bind(this);
    this.createBtn = React.createRef();
    this.joinBtn = React.createRef();
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.roomNameHandler = this.roomNameHandler.bind(this);
    this.channelHandler = this.channelHandler.bind(this);
  }

  componentDidMount(prevprops) {
    const [state, dispatch] = this.context;
    // authState().then((user) => {
    //   dispatch({
    //     type: "USER",
    //     user: user,
    //   });
      // room_list(state, dispatch, user);
    // });
  }

  handleClickOpen = (mode) => {
    mode == "create"
      ? this.setState({ ...this.state, createOpen: true })
      : this.setState({ ...this.state, joinOpen: true });
  };

  // After click on create button

  handleClose = (event) => {
    const [state, dispatch] = this.context;
    room_create(
      state,
      dispatch,
      this.setState,
      this.state.TempRoomName,
      db,
      event,
      this.state,
      this.props.history
    );
  };

  roomNameHandler(event) {
    this.setState({ ...this.state, TempRoomName: event.target.value }); // room Set from input
  }

  channelHandler(event, type) {
    type === "add"
      ? this.props.history.push(
          `/home?room=${this.context[0].channelList[event.target.id].id}`
        )
      : this.props.history.push(
          `/home?room=${this.context[0].joinRoomList[event.target.id].id}`
        ); // after channel create routing
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
        <div className="sidebar_header">{this.context[0]?.username}</div>
        <div className="sidebar_body">
          {/* channel Name + Add Channel  */}
          <p>
            Channels &nbsp; <ArrowDropDownIcon />
          </p>
          <ul>
            {this.context[0].channelList.length != 0 &&
              this.context[0].channelList.map((channel, index) => {
                return (
                  <li
                    key={index}
                    id={index}
                    onClick={(e) => {
                      this.channelHandler(e, "add");
                    }}
                  >
                    # {channel.roomName}
                  </li>
                );
              })}
            <li>
              <Button
                variant="text"
                style={{ color: "inherit", textTransform: "initial" }}
                onClick={() => {
                  this.handleClickOpen("create");
                }}
              >
                Add a channel <AddIcon style={{ right: "-40px", top: "7px" }} />
              </Button>

              <Dialog
                open={this.state.createOpen}
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
                    onKeyPress={(e) => {
                      e.key === "Enter" && this.createBtn.current.click();
                    }}
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
                    ref={this.createBtn}
                  >
                    <span id="create">Create</span>
                  </Button>
                </DialogActions>
              </Dialog>
            </li>
          </ul>
          {/* // joined room  */}
          <p>
            Joined room &nbsp; <ArrowDropDownIcon />
          </p>
          <ul id="joined_room">
            {this.context[0].joinRoomList.length != 0 &&
              this.context[0].joinRoomList.map((room, index) => {
                return (
                  <li
                    key={index}
                    id={index}
                    onClick={(e) => {
                      this.channelHandler(e, "join");
                    }}
                  >
                    # {room.roomName}
                  </li>
                );
              })}
            <li>
              <Button
                variant="text"
                style={{ color: "inherit", textTransform: "initial" }}
                onClick={() => {
                  this.handleClickOpen("join");
                }}
              >
                Join a channel{" "}
                <AddIcon style={{ right: "-40px", top: "7px" }} />
              </Button>

              <Dialog
                open={this.state.joinOpen}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title-2"
                fullWidth={true}
                id="joindialog"
              >
                <DialogTitle id="form-dialog-title-2">Room Id</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    &nbsp; Paste here room id to join &nbsp;&nbsp;&nbsp;
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id=""
                    label="Room id2"
                    type="text"
                    fullWidth
                    onChange={this.roomNameHandler}
                    onKeyPress={(e) => {
                      e.key === "Enter" && this.joinBtn.current.click();
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>

                  <Button
                    id="join"
                    onClick={this.handleClose}
                    color="primary"
                    ref={this.joinBtn}
                  >
                    <span id="join"> Join</span>
                  </Button>
                </DialogActions>
              </Dialog>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Sidebar.contextType = InfoContext;

export default withRouter(Sidebar);
