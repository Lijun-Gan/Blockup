import React from "react";
import openSocket from "socket.io-client";
import Peer from 'peerjs';


export class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: []
    }

    this.socket = openSocket(["https://blockup2021.herokuapp.com", "http://localhost:5000"], {
    // this.socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });

    this.myPeer = new Peer(this.props.user.id, {
        // host: "https://blockup2021.herokuapp.com", 
        // prot: '443',
        path:'/',
        secure: true
        // host: '/',
        // port: '3001'

    });

    this.videoRef = React.createRef()
    this.videoContainer = React.createRef()
    this.peers = {}

    this.leaveMeeting = this.leaveMeeting.bind(this)
  }

  componentDidMount(){

    // const myVideo = document.createElement('video')
    // myVideo.muted = true

    navigator.mediaDevices.getUserMedia({
        video: this.props.match.params.isVideo === "true"? true : false, 
        audio: true,
      }).then(stream => {

        const myVideo = document.createElement('video')
         
        this.addVideoStream(myVideo, stream, this.props.user.id)
      
        // const videoObj = this.videoRef.current;
        // videoObj.srcObject = stream;
        // videoObj.innerHTML = this.props.user.username
        // videoObj.muted = true;
        // videoObj.play();
 
        this.myPeer.on('call', call => {
          
          this.peers[call.peer] = call

          call.answer(stream)

          const video = document.createElement('video')
        
          call.on('stream', userVideoStream => {
            this.addVideoStream(video, userVideoStream,call.peer)
          })

          call.on('close', () => {
            video.remove()
            
            if(document.getElementById(call.peer)){

              document.getElementById(call.peer).remove();
            }

          })
        })
      
        this.socket.on('user-connected', userId => {
            console.log(userId, "**************user connnected")
            setTimeout(()=>{

                this.connectToNewUser(userId, stream)
       
            },1000)
        })
      })
      
      this.socket.on('user-disconnected', userId => {
          console.log("disconnect**************************", userId)
        if (this.peers[userId]) this.peers[userId].close()
      })

    this.myPeer.on('open', id => {
        this.socket.emit("join video chat", this.props.match.params.roomId, id);
      })

  
  }

    connectToNewUser(userId, stream) {
    
      const call = this.myPeer.call(userId, stream)
      const video = document.createElement('video')

      call.on('stream', userVideoStream => {

        this.addVideoStream(video, userVideoStream, userId)   
      })

      call.on('close', () => {
          video.remove()
          if(document.getElementById(userId)){
            document.getElementById(userId).remove();
          }
      })

      this.peers[userId] = call
     
    }

    addVideoStream(video, stream, userId=null) {

      video.srcObject = stream
      if(userId === this.props.user.id){
        video.muted = true;
      } 
      
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })

      let divTag = document.getElementById(userId + "div")
      if(!divTag){

      divTag = document.createElement('div');
        divTag.setAttribute("id", userId + "div")
        divTag.className = "video-div"
        // 

       
        if(!document.getElementById(userId)){
          let pTag = document.createElement('p');
          pTag.innerHTML = this.props.room_members[userId]
          // pTag.innerHTML = this.props.friends[userId] ? this.props.friends[userId] : "not a freind";
          pTag.className = "friend-video-username";
          pTag.setAttribute("id", userId)
      
          divTag.appendChild(pTag);
        }

        divTag.appendChild(video)
      // 
        this.videoContainer.current.appendChild(divTag)
        
      }else{
        let divContainer = document.getElementById(userId + "div")
        if(!document.getElementById(userId)){
          let pTag = document.createElement('p');
          pTag.innerHTML = this.props.room_members[userId]
          // pTag.innerHTML = this.props.friends[userId] ? this.props.friends[userId] : "not a freind";
          pTag.className = "friend-video-username";
          pTag.setAttribute("id", userId)
      
          divContainer.appendChild(pTag);
        }
        divContainer.appendChild(video)

      }

      //   this.videoContainer.current.appendChild(video)
        
      //   if(!document.getElementById(userId)){
      //   let pTag = document.createElement('p');
      //   pTag.innerHTML = this.props.friends[userId] ? this.props.friends[userId] : "not a freind";
      //   pTag.className = "friend-video-username";
      //   pTag.setAttribute("id", userId)
    
      //   this.videoContainer.current.appendChild(pTag);
      // }

      // videos.appendChild(video)
     
      
    }

    leaveMeeting(){

        // window.location.reload();
        const video = document.querySelector('video');
  
        const mediaStream = video.srcObject;
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop())
        this.socket.disconnect()
        this.myPeer.destroy(); 

        this.props.history.push("/")
    }
  
  render(){
    // const myVideo = <video ref={this.videoRef}></video>
      return (
        <div>
            <h2>{this.props.room}</h2>
            <button className="leave-meeting" onClick={this.leaveMeeting}>Leave Meeting</button>
            <div id="videos-container" ref={this.videoContainer} >
                {/* <p className="video-username"> {this.props.user.username}</p>
                {myVideo} */}
            </div>
            
           
        </div>
      )
  }
}
