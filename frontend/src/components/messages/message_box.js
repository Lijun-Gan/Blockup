import React from 'react';

class MessageBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            content: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        // this.props.fetchRoomMessages(this.props.match.params.id)
        console.log("message box");
        console.log(this.props.room._id);
        this.props.fetchRoomMessages(this.props.room._id)
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.createMessage({
            content: this.state.content,
            author: this.props.currentUser.id,
            room: this.props.room._id
        }).then(fetchRoomMessages(this.props.room._id))
    }

    handleChange(){
        return e => this.setState({['content']: e.target.value})
    }

    

    render () {
        const { room, currentUser, fetchRoomMessages, createMessage} = this.props;
        
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Type a message" onChange={this.handleChange()}></input>
                    <input type="submit">Send Message</input>
                </form>
            </div>
        )
    }
}

export default MessageBox;