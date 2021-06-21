import { RECEIVE_USER_LOGOUT } from "../actions/session_actions";
import { RESET_ACTIVE_ROOM, RECEIVE_ACTIVE_ROOM } from "../actions/ui_actions";



const UiReducer = (state = {activeRoom: -1}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ACTIVE_ROOM:
      return Object.assign({}, state, { activeRoom: action.room } );
    case RESET_ACTIVE_ROOM:
      return Object.assign({}, state, { activeRoom: -1} );
    case RECEIVE_USER_LOGOUT:
      return Object.assign({})
    default:
      return state;
  }
};

export default UiReducer;
