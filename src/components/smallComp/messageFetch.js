import onSnapshotIntializer from "./snapshot_update";

/// adjust new updated room -- update message through snapshot function () || update room Name || update roomId

export default function Message_fetching(
  reduxstate,
  dispatch,
  setState,
  db,
  search,
  state
) {
  let name = search;
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

    if (reduxstate.user != null) {
      if (reduxstate.CurrentRoomName != name) {
        !reduxstate.CurrentRoomName == "No Room Selected" &&
          reduxstate.unsubscribe();

        //Each time runs when room changes set room Id

        db.collection("rooms")
          .doc(reduxstate.user.uid)
          .collection("roomManage")
          .where("name", "==", name)
          .get()
          .then((querySnapshot) =>
            querySnapshot.forEach((doc) => {
              onSnapshotIntializer(
                reduxstate,
                dispatch,
                setState,
                doc.id,
                db,
                state
              );
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
