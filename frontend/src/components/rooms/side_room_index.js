import React, { Component } from "react";
// import UiReducer from "../../reducers/ui_reducer";
import SideRoomItem from "./side_room_item";
import openSocket from "socket.io-client";
import { BsPlusCircleFill } from "react-icons/bs";
// const { useState } = React;
import {Link} from "react-router-dom";

export class SideRoomIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      less2peope: "",
      name: "",
      members: {},
      keyWords: '',
    };


    this.socket = openSocket([ "https://blockup2021.herokuapp.com","http://localhost:5000"], {
    // this.socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });


    this.createRoom = this.createRoom.bind(this);
    this.openModal = this.openModal.bind(this);
    this.update = this.update.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClearText = this.handleClearText.bind(this);
  }

  componentDidMount() {
     
    const id = this.props.user.id;

    this.props.fetchUserRooms(id).then(()=>{
      
        if( this.props.activeRoom !== -1 && this.props.activeRoom !== null && this.props.activeRoom ){
          if(this.props.rooms.length > 0 ){
            this.props.fetchRoomMessages(this.props.activeRoom._id)
          }else{
            this.props.resetActiveRoom()
          }
        }

        if(this.props.activeRoom === -1 || this.props.activeRoom === undefined || this.props.activeRoom === null ) {
          
          if(this.props.rooms.length > 0){
            this.props.setActiveRoom(this.props.rooms[0]._id).then(
              ()=>{this.props.fetchRoomMessages(this.props.rooms[0]._id)}
            );
          }
        }
      }).then(()=>{this.props.fetchFriends(this.props.user.id)})

    this.socket.on("create room received", (data, newRoom)=>{

      // if(data.socket_receiver_id === this.props.user.id){
        // this.props.fetchUserRooms(this.props.user.id).then(()=>{

          console.log(this.props.user,"----",this.props, "from sideroomindex recieve sockets")

          this.props.receiveNewRoom(newRoom)

          if((this.props.activeRoom === -1 || this.props.activeRoom === null) && this.props.rooms.length > 0){
            this.props.setActiveRoom(this.props.rooms[0]._id)
          }

          

       
        // })

      // }

    })

    this.socket.on("delete room received", (data)=>{

      if(data.socket_receiver_id === this.props.user.id){    
        
        // this.props.deleteThisRoom({_id: data.roomId})
        // this.props.fetchUserRooms(this.props.user.id).then(()=>{

            // if(this.props.rooms.length > 0 && data.roomId === this.props.activeRoom._id){
            if(this.props.activeRoom && data.roomId === this.props.activeRoom._id){
   
              if(this.props.rooms.length > 1 &&  this.props.roomsIds.includes(data.roomId )){
              
           
                // let setRoom = this.props.rooms.slice(-1)[0]._id === data.roomId ? (this.props.rooms.slice(-2)[0]._id && this.props.rooms[0]._id) : (this.props.rooms.slice(-1)[0]._id && this.props.rooms[0]._id)
                let setRoom = this.props.rooms.slice(-1)[0]._id === data.roomId ? (this.props.rooms.slice(-2)[0]._id) : (this.props.rooms.slice(-1)[0]._id )
              
                this.props.setActiveRoom(setRoom).then(()=>{
      
                  this.props.fetchRoomMessages(setRoom).then(()=>{
                  })
                  
                })
                
                
              }else{
                // this.props.resetActiveRoom();
                this.props.fetchUserRooms(this.props.user.id)
              }
             
              this.props.deleteThisRoom({_id: data.roomId})

            }else{

              const ele = document.getElementById(data.roomId + "roomId");
              if(ele)  ele.style.display = "none";
                
            }
        // })
        }    

    })



  }

  openModal() {
    const ele = document.getElementById("modal");
    ele.style.display = "flex";
  }

  closeModal(){
    const ele = document.getElementById("modal");
    ele.style.display = "none";
  }

  createRoom(e){
    
    e.preventDefault();
    
    
    if( Object.keys(this.state.members).length > 1 && this.state.name !== ""){
      
      const roomMembers = [];

      Object.keys(this.state.members).forEach((member)=>{
        roomMembers.push({_id: member})
      })

      const user = {
        id: this.props.user.id,
        username: this.props.user.username
      };
  
      const room = {
        name: this.state.name,
        user: user,
        members: roomMembers
      };

      this.props.createRoom(room)

      .then(()=>{

        // this.props.fetchUserRooms(this.props.user.id)
        // if(this.props.activeRoom === -1 || this.props.activeRoom === null){
        //   const roomMessageId = this.props.rooms.slice(-1)[0]._id
        //   this.props.setActiveRoom(roomMessageId).then(()=>{
        //     this.props.fetchRoomMessages(roomMessageId)
        //   })
          
        // }
        if(this.props.activeRoom && this.props.activeRoom !== -1){

          this.props.fetchRoomMessages(this.props.activeRoom._id)
        }

        const members = Object.keys(this.state.members) 

        this.socket.emit("enter room", this.props.activeRoom._id, this.props.user.id);
      
        this.socket.emit("create room", members, this.props.activeRoom )
      

      
        this.setState({
          less2peope: "",
          name: "",
          members: {},
          keyWords: '',
        })

        });
        
      this.closeModal();
    }
  }

  update(field) {

    return (e)=> {
      if (field === "name") {
  
            this.setState({
              name: e.currentTarget.value,
            });
      } else {
 
          let newMembers = this.state.members;
          if(e.currentTarget.checked){

            newMembers[e.currentTarget.value] = true;

            this.setState({
              members: newMembers,
            });

          }else{
            delete newMembers[e.currentTarget.value]

            this.setState({
              members: newMembers,
            });
          }

      }
    }
  }

  handleSearch(e){
  
    this.setState({
      keyWords: e.currentTarget.value
    })
  }

  handleClearText(){
    this.setState({
      keyWords: ""
    })
  }

  render() {
    let friends = "";
    const members = this.state.members
    if (this.props.friends) {
      friends = this.props.friends.map((friend) => {
        return (
            // <label className="friend-label" htmlFor={friend.id} key={friend.id}><input type="checkbox" key={friend.id} value={friend.id} id={friend.id} onChange={this.update("members")} />{friend.username}</label>
            <label className="friend-label" htmlFor={friend.id} key={friend.id}><input type="checkbox"  key={friend.id} value={friend.id} id={friend.id} onChange={this.update("members")} checked={members[friend.id] === true ? true : false} />{friend.username}</label>
        );
      });
    }

    let rooms = this.props.rooms

    if(this.state.keyWords){

      rooms = rooms.filter((room)=> {
  
        let target = room.name;
        if(room.members.length === 2){
          target = room.members[0]._id === this.props.user.id ? room.members[1].username : room.members[0].username
        }
        return target.toUpperCase().includes(this.state.keyWords.toUpperCase()) 
       
      })

    }



    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-left">
            {/* <Link to={`/profile`} className="user-icon-link"> <i className="fas fa-user-circle"></i> </Link> */}
            <Link to={`/profile`} className="user-icon-link"> {this.props.user.img_url ?  <img src={this.props.user.img_url} alt="user pic" className="user-pic-chat-room-circle"/> : <i className="fas fa-user-circle"></i> }
            </Link>
            {/* <i className="fas fa-user-circle"></i> */}
            <h3>{this.props.user.username}</h3>
          </div>

          <div className="sidebar-header-right">
            <BsPlusCircleFill size="30px" onClick={this.openModal} />
          </div>

          <form id="modal" onSubmit={this.createRoom} tabIndex="0">
            <div className="close-modal" onClick={this.closeModal}>X</div>
            <p>Create a new room</p>
            <input
              value={this.state.name}
              placeholder="Room name"
              onChange={this.update("name")}>
            </input>
            <p className="select-friends">Please select at least two friends below: </p>
            <div className="all-friends" >
              {friends}
            </div>
            <input
              className="submit-room"
              type="submit"
              value="Create Room"
            ></input>
            <p className="room-notes">Note: this room will only be created if it has more than two members including yourself. Create/enter rooms for only 2 members, please go to the friends page 👥 and click ✉️ </p>
    
          </form>

        </div>
        <div className="sidebar-search">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" onChange={this.handleSearch} value={this.state.keyWords} />
            {this.state.keyWords !== "" ?  <button className="clear-text" onClick={this.handleClearText}>&times;</button> : null }
          </div>
        </div>

        <div className="sidebar-chats">
 
           {/* {rooms.length > 0  && this.props.activeRoom && this.props.activeRoom ? ( */}
           {rooms.length > 0  && this.props.activeRoom && this.props.activeRoom !== -1 && this.props.activeRoom !== undefined ?(
              rooms.map((room) => (
              <SideRoomItem
                key={room._id}
                id={room._id}
                name={room.name}
                rooms={this.props.rooms}
                user={this.props.user}
                setActiveRoom={this.props.setActiveRoom}
                activeRoom={this.props.activeRoom}
                getRoomMessages={this.props.fetchRoomMessages}
                getMessage={this.props.fetchMessage}
                receiveRoomMessage={this.props.receiveRoomMessage}
                destroyRoom={this.props.destroyRoom}
                roomMembers={room.members}
                messages={this.props.messages}
                resetActiveRoom={this.props.resetActiveRoom}
                fetchUserRooms={this.props.fetchUserRooms}
                fetchRoomMessages={this.props.fetchRoomMessages}
                deleteRoom={this.deleteRoom}

              />
            ))
          ) : (
            <p>No rooms</p>
          )}
        </div>
      </div>
    );
  }
}

export default SideRoomIndex;
