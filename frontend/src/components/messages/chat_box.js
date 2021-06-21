import React from "react";
import Chatbody from "./chat_body";
// import io from "socket.io-client";
import openSocket from "socket.io-client";
import {Link} from 'react-router-dom';
import {Picker, emojiIndex} from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';


export class ChatBox extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      content: "",
      newMessages: [],
      emojiPicker: false,
      isListening: false,
      micOn: false,

    };

    
    this.socket = openSocket([ "https://blockup2021.herokuapp.com", "http://localhost:5000"], {
    // this.socket = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });

    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.mic = new this.SpeechRecognition();
    this.mic.continuous = true;
    this.mic.interimResults = true;
    this.mic.lang = 'en-US';
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.handlePicker = this.handlePicker.bind(this);
    this.handleAddEmoji = this.handleAddEmoji.bind(this);
    this.handleIsListen = this.handleIsListen.bind(this);
    this.handleStopListening = this.handleStopListening.bind(this);
  }

  componentDidMount() {
    // if(this.props.activeRoom !== null && this.props.activeRoom !== undefined ){
    // }
  }



  sendSocketIO(msg) {
    // this.socket.emit("message", msg);
  }

  handlePicker(){
    this.setState({emojiPicker: !this.state.emojiPicker});
  }

  handleAddEmoji(emoji){
    const preMessage = this.state.content
    const emojiConverter = this.colonToUnicode(`${emoji.colons}`)
    const newMessage = preMessage + emojiConverter
    this.setState({content: newMessage, emojiPicker: false})
    setTimeout(()=>this.messageInputRef.focus(), 0);
  }

  colonToUnicode(emjoiColon ){

      let emjoiWord = emjoiColon.replace(/:/g, "");
      let unicode = emojiIndex.search(emjoiWord)[0].native
      if (typeof unicode !== "undefined") {
        return unicode;
      }
      return emjoiColon;
  };

  handleIsListen(){
    this.mic.start()

    this.mic.onend = () => {
      console.log('continue...')
      this.mic.start()
    }
 
    this.mic.onstart = () => {
      console.log('Mics on')
    }

    this.mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      console.log(transcript)

      
      this.mic.onerror = event => {
        console.log(event.error)
      }
  
      this.setState({ content: transcript })
    }
    
    this.setState({isListening: !this.state.isListening})
  }
  

  handleStopListening(){

    this.mic.stop()
    this.mic.onend = () => {
      console.log('Stopped Mic on Click')
    }
    
    this.setState({
      isListening: false, 
      micOn: false 
    })
    setTimeout(()=>this.messageInputRef.focus(), 0);

}


  handleSubmit(e) {
    e.preventDefault();
    if(this.state.content){   
      if(!this.state.isListening){    
          const msg = {
            content: this.state.content,
            author: this.props.currentUser.id,
            room: this.props.activeRoom._id,
            
          };

          this.props.createMessage(msg).then(()=>{
      
            this.socket.emit("messages",[this.props.activeRoom._id, this.props.messages.slice(-1)[0] ])
          });

          this.setState({ content: "" });
          // this.sendSocketIO(msg);
        }else{
          this.setState({ micOn: true });
        }
    }

  }

  handleChange() {
    return (e) => this.setState({ content: e.target.value });
  }

  render() {
    const room = this.props.activeRoom;
    const messages = this.props.messages;
    const {emojiPicker} = this.state

    return (
      <div className="chat">
        <div className="chat-header">
        {/* <Link to={`/profile`} className="chat-profile-link"> <i className="fas fa-user-circle"></i> </Link> */}
          {/* <i className="fas fa-user-circle"></i> */}
          <div className="chat-header-info">
            <h3>{!room ? "no rooms" : room.name}</h3>

          </div>
          <div className="-right">
          <Link to={ this.props.activeRoom && this.props.activeRoom !== -1 ?  `/video/${this.props.activeRoom._id}/true` : `/video/${this.props.currentUser.id}/true` } className="msg-link"><i className="fas fa-video"></i></Link>
          <Link to={ this.props.activeRoom && this.props.activeRoom !== -1 ?  `/video/${this.props.activeRoom._id}/false` : `/video/${this.props.currentUser.id}/false` } className="msg-link"> <i className="fas fa-phone"></i></Link>
          </div>
        </div>
        <Chatbody
          user={this.props.currentUser}
          room={room}
          messages={messages}
          newMessages={this.state.newMessages}
          />
          {this.state.micOn ? <p>Turn off the microphone before sending the message! (click 🛑)</p> : null}
        <div className="chat-footer">

          {emojiPicker && (<Picker set="apple"  
          onSelect={this.handleAddEmoji}
          title="Pick your emoji" 
          emoji="point_up" 
          style={{ position: 'absolute', bottom: '65px' }}/>)}

          {/* <button onClick={this.handlePicker}> <i className="fas fa-laugh-wink"></i> </button>  */}

          <i onClick={this.handlePicker} className="fas fa-laugh-wink"></i>  
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Message"
              onChange={this.handleChange()}
              ref={ node => (this.messageInputRef = node)}
              value={this.state.content}
            />
            <button type="submit" className="paper-plane"><i className="fas fa-paper-plane"></i></button>
            {/* <i className="fas fa-paper-plane" type="submit"></i> */}
          </form>
     
          {this.state.isListening ? <span onClick={this.handleStopListening} style={{"marginRight": "10px"}}>🛑</span>  : <i className="fas fa-microphone" onClick={this.handleIsListen}></i>}
        </div>
        
      </div>
    );
  }
}

export default ChatBox;
