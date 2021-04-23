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
    };
  }

  // setting room name from our Store
  componentDidMount() {
    let name = this.props.location.search;
    if (name != "") {
      //  console.log("name",name);

      name = name.split("?");
      name = name.splice(1);
      name = name[0].split("=").splice("1");

      const [state, dispatch] = this.context;
      dispatch({
        type: "SET_ROOM_NAME",
        roomName: name[0],
      });
    }

    this.Message_fetching();
  }

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
      if (state.CurrentRoomName != name) {
        dispatch({
          type: "SET_ROOM_NAME",
          roomName: name,
        });

        //  Let's Fetch Message from firebase (Speific room)
        // run this piece of code when room changes
        db.collection("rooms")
          .doc(name)
          .collection("MessagesDetail")
          .orderBy("timeAtcreated", "asc")
          .onSnapshot((snap) => {
            const MessageData = [];
            snap.forEach((val) => {
              MessageData.push(val.data());
            });
            this.setState({
              ...this.state,
              data: MessageData,
            });
          });
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
            <Chat data={this.state.data} />
          </div>
        </div>
      </>
    );
  }
}

SlackApp.contextType = InfoContext;
export default withRouter(SlackApp);
