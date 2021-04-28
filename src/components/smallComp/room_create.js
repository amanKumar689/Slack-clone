import firebase from 'firebase'
export default function room_create(reduxstate,dispatch,setState,TempRoomName,db,event,state){


    if (event.currentTarget.id === "create") {
        let df = db
          .collection("rooms")
          .doc(reduxstate.user.uid)
          .collection("roomManage")
          .doc();
        df.set({
          name: TempRoomName,
        })
          .then((docRef) => {
            df.collection("messages")
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
            console.log("error", err);
            dispatch({
              type: "alert_model",
              message: err.message,
              Message_type: "error",
              open: true,
            });
          });
      }
      setState({ ...state, open: false }); // manage dialog opening
}