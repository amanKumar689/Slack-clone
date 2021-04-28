import React, { useContext, useEffect, useReducer, useState } from "react";
import SlackApp from "../SlackApp";
import Landing from "./Landing";
import reducer, { InfoContext, intialState, MyInfo } from "./reducer";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
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
    setTimeout(() => {
      authState()
        .then((user) => {
          let username = user.email.split("@").slice(0, 1);

          dispatch({
            type: "SET_USERNAME",
            username: username[0],
            imageUrl: user.photoURL,
          });
          setAuth(true);
        })
        .catch((err) => {
          console.log("error", err);
          dispatch({
            type: "SET_USERNAME",
            username: false,
            imageUrl: null,
          });
          setAuth(false);
        });
    }, 3000);
  }, []);

  console.log("alert model ", state.alert);
  return (
    <>
      <div className="alert">
        <Collapse in={state.alert.open}>
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
            {state.alert.message}
          </Alert>
        </Collapse>
      </div>
      <Router>
        {/* {console.log("Username--",state.username)} */}
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
