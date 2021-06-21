import React, { Component } from "react";

export class ChatBody extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  handleTime(dateTime) {
        let oldDate = new Date(Date.parse(dateTime));
        let currentDate = new Date();
        let dayDiff = currentDate.getDate() - oldDate.getDate();
        let monthDiff = currentDate.getMonth() - oldDate.getMonth();
        let yearDiff = currentDate.getFullYear() - oldDate.getFullYear();

        let year = oldDate.getFullYear() % 100;
        let month = oldDate.getMonth() + 1;
        let day = oldDate.getDate();
        let hours = oldDate.getHours() > 12 ? oldDate.getHours() - 12  : oldDate.getHours();
        let amPm = oldDate.getHours() > 12 ? "PM" : "AM";
        let minutes = oldDate.getMinutes();

        minutes = minutes < 10 ? "0" + minutes : minutes;

        if (dayDiff === 0 && monthDiff === 0 && yearDiff === 0) {
          return `Today at ${hours}:${minutes} ${amPm}`
        } else if (dayDiff === 1 && monthDiff === 0 && yearDiff === 0) {
          return `Yesterday at ${hours}:${minutes} ${amPm}`
        } else {
          return `${month}/${day}/${year} at ${hours}:${minutes}  ${amPm}`
        }
    }

  messageCheck() {
    const room = this.props.room;
    const messages = this.props.messages;
    //newMessages is the array of new messages sent in from created messages
    // let newMessages = this.props.newMessages || [];    

    if (room && room.messages) {
      let roomMessages = []
       messages.forEach((message,idx) => {
        if( idx === 0 || ( idx !==0 && messages[idx]._id !==  messages[idx - 1]._id )){

          roomMessages.push(<p
                key={message._id + `${Math.random(10000)}`}
                className={`chat-message ${
                  this.props.user.id === message.author._id ? "chat-reciever" : ""
                }`}
              >
                <span className="chat-name">{message.author.username}</span>
                {message.content}
                <span className="chat-timestamp">{this.handleTime(message.createdAt)}</span>
              </p>)
        }
      })
    
      return roomMessages
      // return messages.map((message) => (
      // // return room.messages.map((message) => (
      //   <p
      //     key={message._id + `${Math.random(10000)}`}
      //     className={`chat-message ${
      //       this.props.user.id === message.author._id ? "chat-reciever" : ""
      //     }`}
      //   >
      //     <span className="chat-name">{message.author.username}</span>
      //     {message.content}
      //     <span className="chat-timestamp">{this.handleTime(message.createdAt)}</span>
      //   </p>
      // ));

    } else {
      return (
        <div>
          <p>No Messages</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="chat-body">
        {this.messageCheck()}
        <div
          style={{ float: "left", clear: "both" }}
          ref={(el) => {
            this.messagesEnd = el;
          }}
        ></div>
      </div>
    );
  }
}

export default ChatBody;
