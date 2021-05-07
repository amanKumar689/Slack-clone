import firebase from "firebase";
export default function room_create(
  reduxstate,
  dispatch,
  setState,
  TempRoomName,
  db,
  event,
  state,
  history
) {
  if (event.currentTarget.id === "create") {
    let df = db.collection("rooms");
    df.add({
      UID: reduxstate.user.uid,
      roomName: TempRoomName,
    })
      .then((docRef) => {
        docRef
          .collection("messages")
          .doc("startup_message")
          .set({
            message: "welcome to this channel",
            timeAtcreated: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            dispatch({
              type: "alert_model",
              message: "room created",
              Message_type: "success",
              open: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        dispatch({
          type: "alert_model",
          message: err.message,
          Message_type: "error",
          open: true,
        });
      });
  } else if (event.currentTarget.id === "join") {
    history.push(`/home?room=${TempRoomName}`);
  }
  state.createOpen == true
    ? setState({ ...state, createOpen: false })
    : setState({ ...state, joinOpen: false }); // manage dialog opening
}
