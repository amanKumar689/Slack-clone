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

  // push message to Mystore
  const unsubscribe = db
    .collection("rooms")
    .doc(id)
    .collection("messages")
    .orderBy("timeAtcreated", "asc")
    .onSnapshot((snap) => {
      const MessageData = [];
      snap.docChanges().forEach((val) => {
        if (!val.doc.metadata.hasPendingWrites) {
          reduxstate.roomId != "not found" && MessageData.push(val.doc.data());
        }
      });

      dispatch({
        type: "MESSAGE_PUSH",
        message: MessageData,
      });
      const chatBox = document.getElementsByClassName("chatBox_message")[0];
      if (chatBox != undefined) {
        setTimeout(() => {
          chatBox.scrollTop = chatBox.scrollTop + 100;
        }, 500);
      }
    });

  dispatch({
    type: "unsubscribe",
    val: unsubscribe,
  });
}
