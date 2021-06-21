import { connect } from "react-redux";
import { createMessage, fetchRoomMessages } from "../../actions/message_actions";
import MessageBox from "./message_box";


const mSTP = (state, ownProps) => {
    return ({
        currentUser: state.session.user,
        activeRoom: state.ui.activeRoom,
    })
}

const mDTP = (dispatch, ownProps) => {
    return ({
        fetchRoomMessages: roomId => dispatch(fetchRoomMessages(roomId)),
        createMessage: message => dispatch(createMessage(message))
    })
}

export default connect(mSTP, mDTP)(MessageBox);

