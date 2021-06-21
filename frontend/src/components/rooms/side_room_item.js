import React from "react";
import openSocket from "socket.io-client";
// import io from "socket.io-client";

export class SideRoomItem extends React.Component {
  constructor(props) {
    super(props);
    

    this.socket = openSocket([ "https://blockup2021.herokuapp.com","http://localhost:5000"], {
    // this.socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });

    this.firstJoin = true;

    this.joinSocket =  true;

    this.state = {
      
      showMembers: false,
      deleteId: "",

    };

    this.getActiveRoom = this.getActiveRoom.bind(this);
    this.hanleShowMembers = this.hanleShowMembers.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
  }


  componentDidMount() {

    if(this.props.id === this.props.activeRoom._id){
      console.log(this.props.activeRoom.name)
      this.socket.emit("join room", this.props.id);
    }

    // if(this.props.activeRoom._id === this.props.id && this.state.firstJoin){
    //   this.socket.emit("join room", this.props.activeRoom._id);
    //   this.firstJoin =  false ;
    // }
    
    this.socket.on("incoming message", (msg) => {

      console.log("Incoming Message From Server");
     
      if (this.props.user.id !== msg.author._id && msg.room === this.props.activeRoom._id) {

          this.props.receiveRoomMessage(msg);

      }
    });

    this.socket.on("test", (msg) => {
      console.log(msg);
    });

    this.socket.on("enter room received", (data)=>{
   
      if(data.socket_receiver_id === this.props.user.id ){
       
        this.socket.emit("join room", this.props.activeRoom._id);

      }
    })

  }

  // componentDidUpdate(prevProps, prevState){
  //   
  //     if( prevProps.rooms.length < this.props.rooms.length && this.props.id === this.props.activeRoom._id ){
  //         
  //       this.socket.emit("join room", this.props.id);
  //       }
  // }

  openModal(id) {
    return()=>{

      const ele = document.getElementById(id);
      if(ele){
  
        ele.style.display = "flex";
      }

    }
  }

  closeModal(id){
    return()=>{

      // const ele = document.getElementById("delete-room-modal");
      const ele = document.getElementById(id);
      if(ele){
        ele.style.display = "none";
      }

    }
  }


  deleteRoom(id){
    return()=>{

      const room = this.props.rooms.filter((room)=> room._id ===id)[0]
      const roomMembers =[]

      this.props.destroyRoom(id).then(()=> {
     
        // const index = roomMembers.indexOf(this.props.user.id);
        // if (index > -1) {
        //   roomMembers.splice(index, 1);
        // }
        
        room.members.forEach((member)=>{
            if(member._id !== this.props.user.id){
              roomMembers.push(member._id)}
            })
     
        this.socket.emit("delete room", {members: roomMembers, roomId: id});

        if(this.props.rooms.length > 1){
          
          
          
          let setRoom = this.props.rooms.slice(-1)[0]._id === id ? this.props.rooms.slice(-2)[0]._id : this.props.rooms.slice(-1)[0]._id
          // this.props.fetchUserRooms(this.props.user._id ).then(()=>{
            
            this.props.setActiveRoom(setRoom ).then(()=>{

              this.props.fetchRoomMessages(setRoom)


              const ele = document.getElementById(id + "roomId");
              if(ele){
                ele.style.display = "none";
                }
            })
          // })

        }else{

          this.props.resetActiveRoom();
        }
          
        this.closeModal(id)();

      })
    }
  }



  getActiveRoom() {

    // this.socket.emit("leave room", this.props.id);

    this.props.getRoomMessages(this.props.id);

    this.socket.emit("join room", this.props.id);
    this.props.setActiveRoom(this.props.id);
  }

  hanleShowMembers(){
    if(this.state.showMembers){
      this.setState({
        showMembers: false
      })
    }else{
      this.setState({
        showMembers: true
      })
    }
  }

  render() {

    // let roomName;
    // if (this.props.activeRoom) {
    //   roomName = this.props.activeRoom.name;
    // } else {
    //   roomName = "No Rooms no active room";
    // }


    const members = this.props.roomMembers
    let room_member_name;
    let room_member_pic;
    let room_members_pic = "multiple-users.png";
    if(members.length === 2){
      members.forEach(member => {
        if(member._id !== this.props.user.id){
          room_member_name = member.username;
          room_member_pic = member.img_url ?  member.img_url : "default-user.png";
        }

      });

      // room_member_name = this.props.roomMembers[0]._id === this.props.user.id ? this.props.roomMembers[1].username : this.props.roomMembers[0].username
    }

    const showMembersUi =(        
        <ul className="room-members-ul">
          <p>Group ({members.length})</p>
          {members.map((member)=>(
            
            <li key={member._id} className="room-members-li">
              <img src={member.img_url ? member.img_url : "one-user.png" } alt="user pic" className="user-pic-chat-room-small"/>
              <p className="room-friend-request-username">{member.username}</p>
              <p className="room-friend-request-id">id: {member._id}</p>

            </li>
          ))}
        </ul>
    )


    return (

      <div id={this.props.id + "roomId"}>


          <div className="sidebar-chat">
   
              <div onClick={() => this.getActiveRoom()}  className="sidebar-chat-click" >
                  {/* <i className="fas fa-user-circle"></i> */}
                  <img src={members.length === 2 ? room_member_pic : room_members_pic } alt="users pic" className="user-pic-chat-room-big"/>
                  <div className="sidebar-chat-info">
                    <p className="room-name-list">{ room_member_name ? room_member_name : this.props.name}</p>
                    {/* <h3>{this.props.name}</h3> */}
                  </div>
                  {/* <button className="destroy-room" onClick={() => this.props.destroyRoom(this.props.id)}>delete</button> */}

              </div>

{/*  */}
          <div className="room-list-btn">

                <button className="destroy-room" onClick={this.openModal(this.props.id + "deleteRoom")}>delete</button>
                 
                <div id={this.props.id + "deleteRoom" }className="delete-room-modal">
                  <div className="unfriend-modal-container">

                  <div className="close-unfriend-modal" onClick={this.closeModal(this.props.id + "deleteRoom")}>&times;</div>
                      <p className="unfriend-modal-sent">Delete this room ({this.props.name}) will not delete your friendships between you and the members in this room. </p>
                      <button className="unfriend-btn" onClick={this.closeModal(this.props.id + "deleteRoom")}>Cancel</button>
                      {/* <button className="unfriend-btn" onClick={()=> this.props.destroyRoom(this.props.id).then(()=> this.closeModal())}>Confirm</button> */}
                      <button className="unfriend-btn" onClick={this.deleteRoom(this.props.id)}>Confirm</button>

                  </div>

                </div>

                <button className="show-room-members"onClick={this.hanleShowMembers}>members</button>

          </div>
{/*  */}
          </div>
{this.state.showMembers ? showMembersUi : null}



      </div>


    );
  }
}

export default SideRoomItem;
