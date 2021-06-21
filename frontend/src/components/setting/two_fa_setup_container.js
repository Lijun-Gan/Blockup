import { connect } from "react-redux";
import TwoFASetup from "./two_fa_setup";
import * as sessionActions from "../../actions/session_actions";

const mapStateToProps = (state) => ({
  otpauth_url: state.session.user.otpauth_url,
  currentUser: state.session.user,
  loggedIn: state.session.isAuthenticated,
  verified: state.session.isVerified,
  errors: state.errors.session,
});

const mapDispatchToProps = (dispatch) => ({
  verifyTwoFA: (token) => dispatch(sessionActions.verifyTwoFA(token)),
  logout: () => dispatch(sessionActions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TwoFASetup);
