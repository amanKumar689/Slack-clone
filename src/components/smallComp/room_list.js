import { db } from "../../config/config";
export default function room_list(state, dispatch, user) {
  db.collection("rooms")
    .where("UID", "==", user.uid)
    .onSnapshot((snap) => {
      const List = [];
      snap.forEach((val) => {
        List.push({ id: val.id, roomName: val.data().roomName });
      });
      dispatch({
        type: "SET_CHANNELS",
        channels: List,
      });
    });
}
