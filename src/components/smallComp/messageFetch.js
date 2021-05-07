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
  // Get roomName if it is not present in Mystore
  if (
    search != "" &&
    reduxstate.roomId != search // give only once chance when room changes
  ) {
    reduxstate.roomId != null && reduxstate.unsubscribe();
    // 1st Check In my Store and Store will fetch only my rooom
    const result = reduxstate.channelList.every((eachChannel) => {
      if (eachChannel.id == search) {
        dispatch({
          // Room id goes --  -- to my store
          type: "ROOM_ID",
          val: eachChannel.id,
        });
        dispatch({
          // Verified RoomId then set RoomName
          type: "SET_ROOM_NAME",
          roomName: eachChannel.roomName,
        });
        dispatch({
          type: "mode",
          val: "owned",
        });
        onSnapshotIntializer(reduxstate, dispatch, setState, search, db, state); // here i can easilly fetch message for my roomId
        return false;
      } else return true;
    });

    // 2nd Check in database -- may be it is other rooom so i have to join this
    result &&
      db
        .collection("rooms")
        .doc(search)
        .get()
        .then((docRef) => {
          dispatch({
            // Room id goes --  -- to my store
            type: "ROOM_ID",
            val: search,
          });

          if (docRef.data().UID !== reduxstate.user.uid) {
            dispatch({
              type: "mode",
              val: "joined",
            });
            dispatch({
              type: "join",
              val: { roomName: docRef.data().roomName, id: docRef.id },
            });
            dispatch({
              type: "alert_model",
              message: "Room  found",
              Message_type: "success",
              open: true,
            });
            dispatch({
              type: "SET_ROOM_NAME",
              roomName: docRef.data().roomName,
            });
          } else {
            dispatch({
              type: "mode",
              val: "owner",
            });
          }
          onSnapshotIntializer(
            reduxstate,
            dispatch,
            setState,
            search,
            db,
            state
          ); // here i can easilly fetch message for my roomId
        })
        .catch((err) => {
          onSnapshotIntializer(
            reduxstate,
            dispatch,
            setState,
            search,
            db,
            state
          );

          // here i can easilly fetch message for my roomId

          // Room id goes --  -- to my store
          dispatch({
            type: "ROOM_ID",
            val: search,
          });
          dispatch({
            type: "EMPTY_MSG_BOX",
            val: [],
          });
          dispatch({
            type: "SET_ROOM_NAME",
            roomName: "Room Not avalibale",
          });
          dispatch({
            type: "alert_model",
            message: "Room not found",
            Message_type: "error",
            open: true,
          });
        });
  }
  // when got new room  then -- empty my chatbox && -- then load message
  else if (
    reduxstate.roomId != search &&
    search != "" &&
    reduxstate.roomId != null
  ) {
    dispatch({
      type: "SET_ROOM_NAME",
      roomName: "No Room Selected",
    });
  }
}
