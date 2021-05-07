import React, { useContext, useEffect, useReducer, useState } from "react";
import SlackApp from "../SlackApp";
import Landing from "./Landing";
import reducer, { InfoContext } from "./reducer";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Grow from "@material-ui/core/Grow";
import CloseIcon from "@material-ui/icons/Close";
import room_list from "./smallComp/room_list";
import firebase from "firebase";

import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import { authState } from "../config/config";
function Fun() {
  return (
    <>
      <h1>404 NOT FOUND </h1>
    </>
  );
}

const App = () => {
  const [auth, setAuth] = useState(null);
  const [state, dispatch] = useContext(InfoContext);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // console.log("LOGG", user);
        // room_list(state, dispatch, user);
        let username = user.email.split("@").slice(0, 1);
        // console.log("logged in ", user.uid);
        dispatch({
          type: "USER",
          user: user,
        });
        dispatch({
          type: "SET_USERNAME",
          username: username[0],
          imageUrl: user.photoURL || "",
        });
        room_list(state, dispatch, user);
        setAuth(true);
      } else {
        // console.log("OUT", user);        // console.log("Logged out", user);
        dispatch({
          type: "SET_USERNAME",
          username: false,
          imageUrl: null,
        });

        dispatch({
          type:"join",
          val:"empty"
        })

        dispatch({
          type: "SET_CHANNELS",
          channels: [],
        });
        setAuth(false);
      }
    });
  }, []);
  // console.log("insiide app ::", auth);
  return (
    <>
      <div className="alert">
        <Grow in={state.alert.open}>
          <Alert
            variant="filled"
            severity={state.alert.Message_type}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  dispatch({
                    type: "alert_model",
                    open: false,
                    message: "",
                    Message_type: "",
                  });
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            &nbsp;&nbsp;&nbsp; {state.alert.message}
          </Alert>
        </Grow>
      </div>
      <Router>
        <Switch>
          <Route path="/login">
            {state?.username != null &&
              (state?.username ? <Redirect to="/home" /> : <Login />)}
          </Route>
          <Route path="/signup">
            {state?.username != null &&
              (state?.username ? <Redirect to="/home" /> : <Signup />)}
          </Route>
          <Route path="/home">
            {state?.username != null &&
              (state?.username ? <SlackApp /> : <Signup />)}
          </Route>

          <Route exact path="/">
            {auth != null ? (
              state?.username ? (
                <Redirect to="/home" />
              ) : (
                <Redirect to="/login" />
              )
            ) : (
              <Landing />
            )}
          </Route>

          <Route path="*" component={Fun} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
