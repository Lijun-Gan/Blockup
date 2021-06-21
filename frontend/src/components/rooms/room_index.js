import React from "react";
import RoomListItem from "./room_list_item";

class RoomIndex extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rooms: []
        }
    }

    componentDidMount() {
        this.props.fetchUserRooms(this.props.user.id);
    }

    renderErrors() {
        return (
        <ul>
            {Object.keys(this.state.errors).map((error, i) => (
            <li key={`error-${i}`}>{this.state.errors[error]}</li>
            ))}
        </ul>
        );
    }

    render() {
        if (this.props.rooms.length === 0){
            return ( <div>There are no Rooms</div>)
        } else {
            return (
                <div className="room-index">
                    <h2>Your Rooms</h2>
                    <ul>
                      {this.props.rooms.map(room => (
                          <li><RoomListItem key={room._id} name={room.name} /></li>
                      ))}
                    </ul>
                </div>
                );
            }
        }
}

export default RoomIndex;
