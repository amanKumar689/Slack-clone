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

    // room name fetching from url

    let id = this.props.location.search;

    const val =
      id != "" ? id?.split("?").slice(1)[0].split("=").slice(1)[0] : "";

    state.user != null &&
      Message_fetching(state, dispatch, this.setState, db, val, this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    const [state, dispatch] = this.context;
    let id = this.props.location.search;
    const val =
      id != "" ? id.split("?").slice(1)[0].split("=").slice(1)[0] : "";
    state.user != null &&
      Message_fetching(state, dispatch, this.setState, db, val, this.state);
  }

  render() {
    return (
      <>
        <div className="slackClone">
          <Header />
          <div className="slack_body">
            <Sidebar />
            <Chat data={this.context[0].MessageStore} />
          </div>
        </div>
      </>
    );
  }
}

SlackApp.contextType = InfoContext;
export default withRouter(SlackApp);
