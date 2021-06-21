import { combineReducers } from "redux";
import session from "./session_api_reducer";
import errors from "./errors_reducer";
import RoomsReducer from "./rooms_reducer";
import MessagesReducer from "./messages_reducer";
import friendshipReducer from "./friendships_reducer";
import friendRequestReducer from "./friendRequests_reducer";
import UiReducer from "./ui_reducer";

const RootReducer = combineReducers({
  errors,
  session,
  rooms: RoomsReducer,
  messages: MessagesReducer,
  friendships: friendshipReducer,
  friendRequests: friendRequestReducer,
  ui: UiReducer,
});

export default RootReducer;
