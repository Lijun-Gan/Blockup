import React from "react";
import openSocket from "socket.io-client";

class Friendship extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverId: '',
      cannotAddSelf: '',
      cannotBeEmpty: '',
      lengthTooShort: '',
      lengthTooLong: '',
      cannotFindUser: '',
      cannotRequestAgain: '',
      cannotFriendAgain: '',
    };

    this.socket = openSocket([ "https://blockup2021.herokuapp.com","http://localhost:5000"], {
    // this.socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });


    this.sendFriendsRequest = this.sendFriendsRequest.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
    this.updateInput =  this.updateInput.bind(this); 
    
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleRoom = this.handleRoom.bind(this);
    this.handleClearText = this.handleClearText.bind(this);

  }

  

  componentDidMount() {
 
    this.props.fetchFriendRequests(this.props.user.id)
    this.props.fetchFriendships(this.props.user.id)
    this.props.fetchUserRooms(this.props.user.id)

    this.socket.on("friend request accepted", (data )=>{

      if(data.sender_id === this.props.user.id){

        this.props.fetchFriendRequests(this.props.user.id).then(()=>{
          this.props.fetchFriendships(this.props.user.id).then(()=>{
            this.props.fetchUserRooms(this.props.user.id)
          })
        })
      }
    })

    this.socket.on("friend request cancelled", (data )=>{
      
      if(data.socket_receiver_id === this.props.user.id){
        
        this.props.fetchFriendRequests(this.props.user.id)
      }
    })

    this.socket.on("unfriend received", (data )=>{
      
      if(data.socket_receiver_id === this.props.user.id){
        
        this.props.fetchFriendships(this.props.user.id).then(()=>{
          this.props.fetchUserRooms(this.props.user.id)
        })
      }
    })

  }

  
  updateInput(e) {
    
    this.setState({
      receiverId: e.target.value,
    });
  }
  
  handleClearText(){
    this.setState({
      receiverId: "",
      cannotAddSelf: '',
      cannotBeEmpty: '',
      lengthTooShort: '',
      lengthTooLong: '',
      cannotFindUser: '',
      cannotRequestAgain: '',
      cannotFriendAgain: '',
    })
  }
  
  sendFriendsRequest(e){
    e.preventDefault()
    let errs = 0;
    let addSelf = '';
    let beEmpty = '';
    let tooShort ='';
    let tooLong ='';
    let findUser ='';
    let requestAgain = '';
    let friendAgain = '';
    
    
    
    if (this.state.receiverId === this.props.user.id) {
      addSelf = <p className="id-error">Friend id cannot be your own user id </p>
      errs++;
 
    }

    if (this.state.receiverId === "") {
      beEmpty = <p className="id-error">Friend id cannot be empty </p>
      errs++;
    }

    if (this.state.receiverId.length < 24) {
      tooShort = <p className="id-error">Friend id cannot be short than 24 digits </p>
      errs++;
    }

    if (this.state.receiverId.length > 24) {
      tooLong = <p className="id-error">Friend id cannot be longer than 24 digits </p>
      errs++;
    }

    if(this.props.friends.includes(this.state.receiverId)){
      friendAgain = <p className="id-error">Cannot add an existing friend </p>
      errs++;
    }

    if(this.props.requests.includes(this.state.receiverId)){
      friendAgain = <p className="id-error">An friend request with this id is received/sent already</p>
      errs++;
    }

    this.setState({
      cannotAddSelf: addSelf ,
      cannotBeEmpty: beEmpty,
      lengthTooShort: tooShort,
      lengthTooLong: tooLong,
      cannotFindUser: findUser,
      cannotRequestAgain: requestAgain,
      cannotFriendAgain: friendAgain,
    })
    
    if(errs === 0){
      this.props.makeFriendRequest({senderId: this.props.user.id, receiverId: this.state.receiverId}).then(()=>{

        this.socket.emit("friend request", {receiver_id: this.state.receiverId, sender_id: this.props.user.id,sender_username: this.props.user.username});
        this.setState({
          receiverId: "",
        })
      }, (res)=>{

        if(res.response.data.idCannotfound  === "Entered id cannot be found"){
          findUser = <p className="id-error">Entered id cannot be found </p>
          this.setState({
            cannotFindUser: findUser
          })
        }
      }) 
    }
  }

  acceptRequest(friendRequest){
    return ()=>{
      this.props.deleteFriendRequest(friendRequest._id)
      .then(()=>{
        this.props.createFriendship(
        {friend1: friendRequest.senderId._id , 
        friend2: friendRequest.receiverId._id})}).then(()=>{

          this.socket.emit("accepted friend request", {receiver_id: this.props.user.id, sender_id: friendRequest.senderId._id});
          
          const rooms = Object.values(this.props.rooms).filter((ele)=>{

            return (ele.members.length === 2 && ele.members.every(member => [friendRequest.senderId._id , friendRequest.receiverId._id].includes(member._id)))
          })
  
  
          if(rooms.length === 0){
            const user = {
                id: friendRequest.receiverId._id,
                username: friendRequest.receiverId.username
              };
              const room = {
                name: friendRequest.senderId.username + " & " +  friendRequest.receiverId.username,
                user: user,
                members: [{_id: friendRequest.senderId._id} ]
              };

              this.props.createRoom(room).then(()=>{
                this.socket.emit("create room",[friendRequest.senderId._id],this.props.activeRoom);
                
              })
              // .then(()=>{
            
              //   this.props.fetchUserRooms(this.props.user.id)
              // })
            }

        })
    }
  }


  cancelRequest(friendRequest){
    return ()=>{
      this.props.deleteFriendRequest(friendRequest[0])
      .then(()=>{
        if(friendRequest[1] === "sent"){
          
          this.socket.emit("cancel friend request", {id: this.props.user.id, socket_receiver_id: friendRequest[2]});
        }else{
          
          this.socket.emit("cancel friend request", {socket_receiver_id: friendRequest[2], id: this.props.user.id});
        }

      })
    }
  }

  openModal(id) {
    return()=>{
      const ele = document.getElementById(id);
      if(ele){
        ele.style.display = "flex";
      }
    }
  }

  closeModal(id){
    return ()=>{
      const ele = document.getElementById(id);
      if(ele){
        ele.style.display = "none";
      }
    }
  }

  handleUnfriend(ids){
    return()=>{

      let room_id;

      this.closeModal(ids[0]+"unfriend-modal")()
      
      this.props.deleteFriendship(ids[0]).then(()=>{
        

        Object.values(this.props.rooms).forEach((ele)=>{
           
          if(ele.members.length === 2 && ele.members.every(member => ids.slice(1).includes(member._id))){
            room_id =  ele._id
            this.props.destroyRoom((ele._id))
          }
        })
      }).then(()=>{

        const socket_id = ids[1] === this.props.user.id ? ids[2] : ids[1]
        this.socket.emit("unfriend", {socket_receiver_id: socket_id, id: this.props.user.id});

        const member = this.props.user.id === ids[1] ? ids[2] : ids[1]

        this.socket.emit("delete room", {members: [member], roomId: room_id});
        
      })

    }
  }



  handleRoom(ids){
   
    return()=>{
      

        const rooms = Object.values(this.props.rooms).filter((ele)=>{

          return (ele.members.length === 2 && ele.members.every(member => ids.slice(0,2).includes(member._id)))
        })


        if(rooms.length > 0){

          this.props.setActiveRoom((rooms[0]._id)).then(()=>{
          
            this.socket.emit("enter room", this.props.activeRoom._id, this.props.user.id);
          
            this.props.history.push('/web')
          
          })
        }else{
          

          const user = {
            id: ids[1],
            username: ids[3]
          };
          const room = {
            name: ids[2] + " & " +  ids[3],
            user: user,
            members: [{_id: ids[0]} ]
          };
    
          // const that = this
      

          this.props.createRoom(room).then(()=>{

            const friendId = ids[0] === this.props.user.id ? ids[1] : ids[0]
           
            this.socket.emit("create room",[friendId],this.props.activeRoom);

            this.handleRoom(ids)()
      
            //   const rooms = Object.values(that.props.rooms).filter((ele)=>{
            //    return (ele.members.length === 2 && ele.members.every(member => ids.slice(0,2).includes(member._id)))
            //  })
     
            //  if(rooms.length > 0){
            //    that.props.setActiveRoom((rooms[0]._id)).then(()=>{
            //    that.props.history.push('/web')
            //     })
            //   }

          })
        }
    }
  }



  render(){
   
      let friends = (
        <div className="friendship-all-friends">
                {Object.values(this.props.friendships).map((friendship,idx)=>(
                  <div className="individual-msg" key={idx}>
                      <img src={ friendship.friend1._id === this.props.user.id?  (friendship.friend2.img_url ? friendship.friend2.img_url : "default-user.png" ) :   (friendship.friend1.img_url ? friendship.friend1.img_url : "default-user.png" ) } alt="user pic" className="user-pic-friendship"/>
                      <p className="friend-page-username">{friendship.friend1._id === this.props.user.id ? friendship.friend2.username : friendship.friend1.username}</p>
                      <p className="friend-page-lastest-msg">{this.props.roomsFor2[friendship.friend1._id === this.props.user.id ? friendship.friend2._id : friendship.friend1._id]}</p>
                      {/* <Link to={`/`} className="msg-link">✉️ </Link> */}
                      <button onClick={this.handleRoom([friendship.friend1._id,friendship.friend2._id,friendship.friend1.username, friendship.friend2.username])} className="msg-button">✉️ 
                        <span className="msgtext">Enter/Create the room with {friendship.friend1._id === this.props.user.id ? friendship.friend2.username : friendship.friend1.username}</span>
                      </button>
                      {/* <button className="unfriend" onClick={this.handleUnfriend([friendship._id,friendship.friend1._id,friendship.friend2._id])}>❌ */}
                      <button className="unfriend" onClick={this.openModal(friendship._id + "unfriend-modal")}>❌
                        <span className="unfriendtext">Delete {friendship.friend1._id === this.props.user.id ? friendship.friend2.username : friendship.friend1.username}</span>
                      </button>


                      <div id={friendship._id + "unfriend-modal"} className="unfriend-modal">
                        <div className="unfriend-modal-container">

                          <div className="close-unfriend-modal" onClick={this.closeModal(friendship._id + "unfriend-modal")}>&times;</div>
                          <p className="unfriend-modal-sent">Delete this friend ({friendship.friend1._id === this.props.user.id ? friendship.friend2.username : friendship.friend1.username}) will also delete the room belongs to you two. </p>
                          <button className="unfriend-btn" onClick={this.closeModal(friendship._id + "unfriend-modal")}>Cancel</button>
                          <button className="unfriend-btn" onClick={this.handleUnfriend([friendship._id,friendship.friend1._id,friendship.friend2._id])}>Confirm</button>

                        </div>

                      </div>


                  </div>
                ))}
          </div>
      )


      let friend_request = [];
      let friend_sent = [];

      Object.values(this.props.friendRequests).forEach(e => {
        if(e.receiverId._id === this.props.user.id ){
            friend_request.push(e)
        }else{
            friend_sent.push(e)
          }
      });

      let friendRequests;

  if (friend_request.length >0){     
    friendRequests = (
        <div className ="request-receiver">
          <p className="all-requests">📥 Friend requests received</p>
          {friend_request.map((friendReq,idx)=>(
            <div key={idx} className="friendrequest-container">

              <div className="friendrequest-img-username">

                <img src={friendReq.senderId.img_url ?  friendReq.senderId.img_url : "default-user.png" } alt="user pic" className="user-pic-friendrequest"/>
                <p>{friendReq.senderId.username}</p>

              </div>

                <button  onClick={this.acceptRequest(friendReq)}>Accept</button>
                <button className="delete-request" onClick={this.cancelRequest([friendReq._id, "received", friendReq.senderId._id])}>Delete</button>
            </div>
          ))}
        </div>
      );
    }

    let sentRequests;

    if (friend_sent.length > 0){     
      sentRequests = (
        <div className ="request-sender">
        <p className="all-requests">📤 Friend requests sent</p>
          {friend_sent.map((req,idx)=>(
            <div key={idx} className="friendrequest-container">
              <div className="friendrequest-img-username">
                <img src={req.receiverId.img_url ?  req.receiverId.img_url : "default-user.png" } alt="user pic" className="user-pic-friendrequest"/>
                <p>{req.receiverId.username}</p>
              </div>
              {/* <button onClick={(e)=>{this.props.deleteFriendRequest(e)}}>Cancel</button> */}
              <button onClick={this.cancelRequest([req._id,"sent",req.receiverId._id])}>Cancel</button>
            </div>
          ))}
      </div>
      )
    }
   
    const username = this.props.user.username

      return(
        <div className="friends-container">
          <p className="friends-title">{username[0].toUpperCase() + username.slice(1)}'s Friends</p>
          <div className="inner-container">
            {friends}
            <div className="right-container">
              {this.state.cannotAddSelf}
              {this.state.cannotBeEmpty}
              {this.state.lengthTooShort}
              {this.state.lengthTooLong}
              {this.state.cannotFindUser}
              {this.state.cannotRequestAgain}
              {this.state.cannotFriendAgain}
              <p className="add-friend-p">Add Friend</p>
              <form className="add-friend" onSubmit={this.sendFriendsRequest}>
                <div className="friend-id-delete">

                  <input className="put-friend-id" onChange={this.updateInput} placeholder="Enter your friend id" type="text" value={this.state.receiverId}/>
                  {this.state.receiverId !== "" ?  <button className="clear-text-friendship" onClick={this.handleClearText}>&times;</button> : null }
                
                </div>

                <button className="add-btn">➕</button>
              </form>
              <p className="add-friend-note">Note: Your friend id is your friend's user id which can be found in his/her profile page. Also, you can find it in the room page 💬 by clicking MEMBERS if you are in the room with this user. </p>
              {friendRequests}
              {sentRequests}

          </div>
          </div>
          
        </div>
      )
  }
}

export default Friendship;