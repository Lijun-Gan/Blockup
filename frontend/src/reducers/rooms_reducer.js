import {
  RECEIVE_NEW_ROOM,
  RECEIVE_ROOMS,
  RECEIVE_SINGLE_ROOM,
  DELETE_ROOM,
} from "../actions/room_actions";
import { RECEIVE_USER_LOGOUT } from "../actions/session_actions";

const RoomsReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state)
  switch (action.type) {
    case RECEIVE_NEW_ROOM:
    
      nextState = Object.assign({}, nextState, { [action.room._id]: action.room });

      return nextState;

    case RECEIVE_ROOMS:

      let roomsObj = {};
      action.rooms.forEach((room) => {
        roomsObj[room._id] = room;
      });
      // const newState = Object.assign({}, nextState, roomsObj);
      // return newState;
      return roomsObj;
      
    case RECEIVE_SINGLE_ROOM:
      return action.room;
    case DELETE_ROOM:
      delete nextState[action.room._id];
      
      return nextState;
    case RECEIVE_USER_LOGOUT:
      return Object.assign({});
    default:
      return state;
  }
};

export default RoomsReducer;
