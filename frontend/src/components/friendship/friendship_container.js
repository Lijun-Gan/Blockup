import { connect } from "react-redux";
import { fetchFriendships, fetchFriendRequests, createFriendship, makeFriendRequest, deleteFriendRequest, deleteFriendship} from "../../actions/friendship_actions";
import Friendship from "./friendship";
import {composeRoom, deleteUserRoom, fetchUserRooms} from '../../actions/room_actions';
import { fetchRoomMessages } from "../../actions/message_actions";
import { fetchActiveRoom } from "../../actions/ui_actions";

const mapStateToProps = (state) => {
  let rooms2 = {};
  
  Object.values(state.rooms).forEach((room)=>{
    if(room.members.length === 2){
      let key = room.members[0]._id === state.session.user.id ? room.members[1]._id : room.members[0]._id
      let value = room.messages.length > 0 ? room.messages.slice(-1)[0].content : 'No conversation yet !'
      rooms2[key] = value
    }
  })

  let userFriends = [];
  Object.values(state.friendships).forEach((friendship)=>{
    userFriends.push(friendship.friend1._id === state.session.user.id ? friendship.friend2._id : friendship.friend1._id)
  })

  let userRequests = [];
  Object.values(state.friendRequests).forEach((friendRequest)=>{
    userRequests.push(friendRequest.receiverId._id === state.session.user.id ? friendRequest.senderId._id : friendRequest.receiverId._id)
  })
  
  return {
    user: state.session.user,
    friendships: state.friendships,
    friendRequests: state.friendRequests,
    rooms: state.rooms,
    roomsFor2: rooms2,
    friends: userFriends,
    requests: userRequests,
    activeRoom: state.ui.activeRoom,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFriendships: (id) => dispatch(fetchFriendships(id)),
    fetchFriendRequests: (id) => dispatch(fetchFriendRequests(id)),
    makeFriendRequest: (friendRequest)=> dispatch(makeFriendRequest(friendRequest)),
    createFriendship: (friendship) => dispatch(createFriendship(friendship)),
    deleteFriendship: (friendship_id) => dispatch(deleteFriendship(friendship_id)),
    deleteFriendRequest: (friendRequest_id) => dispatch(deleteFriendRequest(friendRequest_id)),
    createRoom: (room) => dispatch(composeRoom(room)),
    fetchUserRooms: (id) => dispatch(fetchUserRooms(id)),
    fetchRoomMessages: (roomId) => dispatch(fetchRoomMessages(roomId)),
    destroyRoom: (id) => dispatch(deleteUserRoom(id)),
    setActiveRoom: (id) => dispatch(fetchActiveRoom(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Friendship);
