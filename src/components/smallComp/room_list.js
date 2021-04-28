import { db } from "../../config/config";
export default function room_list(state, dispatch, user) {
  db.collection("rooms")
    .doc(user.uid)
    .collection("roomManage")
    .onSnapshot((snap) => {
      const List = [];
      snap.forEach((val) => {
        List.push(val.data().name);
      });

      dispatch({
        type: "SET_CHANNELS",
        channels: List,
      });
    });
}
