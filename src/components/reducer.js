import { createContext, useContext, useReducer } from "react";
const intialState = {
  channelList: [],
  username: null,
  imageUrl: "null",
  CurrentRoomName: "No Room Selected",
  CurrentClass: "",
  closeBtnShow: false,
  CloseBtn: false,
  menuBtn: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CHANNELS":
      return { ...state, channelList: action.channels };
    case "SET_USERNAME":
      return { ...state, username: action.username, imageUrl: action.imageUrl };

    case "SET_ROOM_NAME":
      return { ...state, CurrentRoomName: action.roomName };
    case "SET_CURRENT_CLASS":
      return {
        ...state,
        CurrentClass: action.val,
        CloseBtn: action.CloseBtn,
        menuBtn: action.menuBtn,
      };

    default:
  }
}
const InfoContext = createContext();
//        Component Wrapper
export const MyInfo = ({ reducer, intialState, children }) => (
  <InfoContext.Provider value={useReducer(reducer, intialState)}>
    {children}
  </InfoContext.Provider>
);

export default reducer;
export { intialState, InfoContext };
