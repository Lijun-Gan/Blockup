import React from "react";
import { fetchFriendships } from "../../actions/friendship_actions";
import { composeRoom } from "../../actions/room_actions";

class CreateRoomForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            members= []
        }
    }

    render(){
        return(
        <form id="modal" onSubmit= {this.createRoom}>
            <p>Create a new Room</p>
            <input placeholder="Room name" onChange={this.update('name')}></input>
            <select onChange={this.update("members")}>
              {friends}
            </select>
            <input type="submit"></input>
        </form>
        )
    }

}

const mapStateToProps = state => {
    return {
        modal: state.ui.modal,
        friends: state.friendships
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFriends: (id) => dispatch(fetchFriendships(id)),
        createRoom: (room) => dispatch(composeRoom(room))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoomForm);