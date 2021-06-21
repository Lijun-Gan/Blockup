import { connect } from "react-redux";
import {VideoChat} from "./video_chat";

const mapStateToProps = (state,ownProps) => {
    const myFriends = {};
    state.session.user.friends.forEach(friend => {
      myFriends[friend.id] = friend.username
    });

    const members = {};
    const room = state.rooms[ownProps.match.params.roomId];
    if(room){  
      room.members.forEach(member => {
      members[member._id] = member.username
      })
    }else{
      members[state.session.user.id] = state.session.user.username
    }

  return {
    user: state.session.user,
    errors: state.errors.session,
    room: state.ui.activeRoom.name,
    friends: myFriends,
    room_members: members
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//   };
// };

export default connect(mapStateToProps, null)(VideoChat);
