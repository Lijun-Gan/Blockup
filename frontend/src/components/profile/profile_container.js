import { connect } from "react-redux";
import Profile from "./profile";
import {uploadPicture }  from "../../actions/session_actions"

const mapStateToProps = (state) => {
    return ({
        user: state.session.user,
        verified: state.session.isVerified,
    })
}
const mapDispatchToProps = (dispatch) => {
    return ({
        uploadPicture: (data, config) => dispatch(uploadPicture(data,config))
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)