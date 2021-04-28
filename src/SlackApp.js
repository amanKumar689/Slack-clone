import React, { useReducer } from "react";
import "./style/app.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { withRouter } from "react-router-dom";
import { db } from "./config/config";
import { InfoContext } from "./components/reducer";
import Message_fetching from "./components/smallComp/messageFetch";
import onSnapshotIntializer from "./components/smallComp/snapshot_update";
class SlackApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      runStatus: true,
      unsubscribe: null,
    };
    this.setState = this.setState.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    const [state, dispatch] = this.context;
    Message_fetching(
      state,
      dispatch,
      this.setState,
      db,
      this.props.location.search,
      this.state
    );
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
