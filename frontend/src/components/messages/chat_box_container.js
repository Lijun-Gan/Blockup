import { connect } from "react-redux";
import {
  createMessage,
  fetchRoomMessages,
  receiveRoomMessage,
} from "../../actions/message_actions";
import ChatBox from "./chat_box";

const mSTP = (state, ownProps) => {
  return {
    currentUser: state.session.user,
    rooms: state.rooms,
    activeRoom: state.ui.activeRoom,
    messages: state.messages,
  };
};

const mDTP = (dispatch, ownProps) => {
  return {
    fetchRoomMessages: (roomId) => dispatch(fetchRoomMessages(roomId)),
    createMessage: (message) => dispatch(createMessage(message)),
    receiveRoomMessage: (message) => dispatch(receiveRoomMessage(message)),

  };
};

export default connect(mSTP, mDTP)(ChatBox);
