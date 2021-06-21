import {
  RECEIVE_ROOM_MESSAGE,
  RECEIVE_MESSAGE,
  RECEIVE_ROOM_MESSAGES,
} from "../actions/message_actions";

const MessagesReducer = (state = [], action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_MESSAGE:
      return [...state, action.message];
      // console.log("Message Action________");
      // console.log(action.message);
      // return state;
    case RECEIVE_ROOM_MESSAGE:
      return [...state, action.message];
      // console.log("Message Action________NEW");
      // console.log(action.message);
      // return state;
    case RECEIVE_ROOM_MESSAGES:
      return action.messages;
    // let messages = {};
    // action.messages.forEach(message => {
    //     messages[message.id] = message
    // })
    // return Object.assign({}, state, messages)
    default:
      return state;
  }
};

export default MessagesReducer;
