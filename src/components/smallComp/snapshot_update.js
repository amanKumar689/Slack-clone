//  Work --  initialize snapshot for updated room -- || update message  to Store ||

export default function onSnapshotIntializer(
  reduxstate,
  dispatch,
  setState,
  id,
  db,
  state
) {
    dispatch({
        type: "EMPTY_MSG_BOX",
        val: [],
      });
  const unsubscribe = db
    .collection("rooms")
    .doc(reduxstate.user.uid)
    .collection("roomManage")
    .doc(id)
    .collection("messages")
    .orderBy("timeAtcreated", "asc")
    .onSnapshot((snap) => {
      const MessageData = [];
      snap.docChanges().forEach((val) => {
        if (!val.doc.metadata.hasPendingWrites) {
          MessageData.push(val.doc.data());
        }
      });

      dispatch({
        type: "MESSAGE_PUSH",
        message: MessageData,
      });
    });



  setState({ ...state, unsubscribe: unsubscribe });
}
