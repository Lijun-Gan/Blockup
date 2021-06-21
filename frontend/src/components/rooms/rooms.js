import React from "react";
import { withRouter } from "react-router-dom";
import RoomIndex from "./room_index_container";

class Rooms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearedErrors = false;
  }

  update(field) {
    return (e) =>
      this.setState({
        [field]: e.currentTarget.value,
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    let room = {
      name: this.state.name,
      user: this.props.user,
    };
    e.currentTarget.value = "";
    this.props.createRoom(room);
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
    return (
      <div className="rooms">
        <form onSubmit={this.handleSubmit}>
          
          <input
            className="room-new-input"
            placeholder="Room name"
            value={this.state.name}
            onChange={this.update("name")}>
          </input>

          <input type="submit" className="room-submit"></input>

        </form>

        <div><RoomIndex /></div>
    
      </div>
    );
  }
}

export default withRouter(Rooms);
