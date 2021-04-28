import React, { useReducer } from "react";
import "./style/app.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { withRouter } from "react-router-dom";
import { db } from "./config/config";
import { InfoContext } from "./components/reducer";


class SlackApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      runStatus: true,
      unsubscribe: null,
    };
  }

  // setting room name from our Store
  componentDidMount() {
    const [state, dispatch] = this.context;
    let name = this.props.location.search;

    if (name != "") {
      name = name.split("?");
      name = name.splice(1);
      name = name[0].split("=").splice("1");
      name = name[0];
      if (name.search("%")) {
        let check = name.split("%20");
        check = check.join(" ");
        name = check;
      }

      dispatch({
        type: "SET_ROOM_NAME",
        roomName: name[0],
      });
    }
  }

  // Method 1

  onSnapshotIntializer(id) {
    const [state, dispatch] = this.context;

    const unsubscribe = db
      .collection("rooms")
      .doc(state.user.uid)
      .collection("roomManage")
      .doc(id)
      .collection("messages")
      .orderBy("timeAtcreated", "asc")
      .onSnapshot((snap) => {
        const MessageData = [];
        snap.docChanges().forEach((val) => {
          if (!val.doc.metadata.hasPendingWrites) {
            MessageData.push(val.doc.data());
          }
        });

        dispatch({
          type: "MESSAGE_PUSH",
          message: MessageData,
        });
      });

    dispatch({
      type: "EMPTY_MSG_BOX",
      val: [],
    });

    this.setState({ ...this.state, unsubscribe: unsubscribe });
  }

  //Method 2

  //Fetching Messages first time when room changes

  Message_fetching() {
    const [state, dispatch] = this.context;
    let name = this.props.location.search;
    if (name != "") {
      name = name.split("?");
      name = name.splice(1);
      name = name[0].split("=").splice("1");
      name = name[0];
      if (name.search("%")) {
        let check = name.split("%20");
        check = check.join(" ");
        name = check;
      }

      if (state.user != null) {
        if (this.context[0].CurrentRoomName != name) {
          !this.context[0].CurrentRoomName == "No Room Selected" &&
            this.state.unsubscribe();

          //Each time runs when room changes set room Id

          db.collection("rooms")
            .doc(state.user.uid)
            .collection("roomManage")
            .where("name", "==", name)
            .get()
            .then((querySnapshot) =>
              querySnapshot.forEach((doc) => {
                this.onSnapshotIntializer(doc.id);
                dispatch({
                  type: "ROOM_ID",
                  val: doc.id,
                });
              })
            );

          dispatch({
            type: "SET_ROOM_NAME",
            roomName: name,
          });

          // when got new room  then -- empty my chatbox && -- then load message
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.Message_fetching();
  }

  render() {
    return (
      <>
        
        <div className="slackClone">
          <Header />
          <div className="slack_body">
            <Sidebar />
            <Chat data={this.context[0].MSG} />
          </div>
        </div>
      </>
    );
  }
}

SlackApp.contextType = InfoContext;
export default withRouter(SlackApp);
