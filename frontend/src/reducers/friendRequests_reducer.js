import {
  RECEIVE_FRIEND_REQUEST,
  RECEIVE_FRIEND_REQUESTS,
  DELETE_FRIEND_REQUEST,
} from "../actions/friendship_actions";

const friendRequestReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch (action.type) {
    case RECEIVE_FRIEND_REQUESTS:
      // return Object.assign({}, action.friendRequests)
      let b = {};

      action.friendRequests.forEach((e) => {
        let { senderId, receiverId, _id, status } = e;
        b[e._id] = { senderId, receiverId, _id, status };
      });
      return b;

    case RECEIVE_FRIEND_REQUEST:
      let { senderId, receiverId, _id, status } = action.friendRequest;

      nextState[action.friendRequest._id] = {
        senderId,
        receiverId,
        _id,
        status,
      };

      return nextState;

    case DELETE_FRIEND_REQUEST:
      delete nextState[action.friendRequest._id];
      return nextState;

    default:
      return state;
  }
};

export default friendRequestReducer;
