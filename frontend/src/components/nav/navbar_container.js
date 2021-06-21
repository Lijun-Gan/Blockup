import { connect } from "react-redux";
import * as sessionActions from "../../actions/session_actions";
import {fetchFriendRequests } from "../../actions/friendship_actions";
import { fetchUserRooms } from "../../actions/room_actions";
import { fetchActiveRoom, resetActiveRoom } from "../../actions/ui_actions";
import { fetchRoomMessages } from "../../actions/message_actions";

import NavBar from "./navbar";

const mapStateToProps = (state) => ({
  loggedIn: state.session.isAuthenticated,
  verified: state.session.isVerified,
  currentUser: state.session.user,
  rooms: Object.values(state.rooms),
  activeRoom: state.ui.activeRoom,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(sessionActions.logout()),
  receiveCurrentUser: currentUser => dispatch(sessionActions.receiveCurrentUser(currentUser)),
  fetchFriendRequests: (id) => dispatch(fetchFriendRequests(id)),
  fetchUserRooms: (id) => dispatch(fetchUserRooms(id)),
  fetchActiveRoom: (id) => dispatch(fetchActiveRoom(id)),
  resetActiveRoom: () => dispatch(resetActiveRoom()),
  fetchRoomMessages: (roomId) => dispatch(fetchRoomMessages(roomId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
