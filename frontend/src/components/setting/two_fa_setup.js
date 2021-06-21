import React from "react";
import qrcode from "qrcode";
import { withRouter} from "react-router-dom";

class TwoFASetup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      token: "",
      verified: this.props.verified,
    };
  }

  componentDidMount() {
    this.setState({ verified: this.props.verified });
  }

  handleSubmit(e) {
    e.preventDefault();
    let data = {
      token: this.state.token,
      userId: this.props.currentUser.id,
    };

    this.props.verifyTwoFA(data);
    this.setState({ token: "" });
  }

  update() {
    return (e) =>
      this.setState({
        token: e.currentTarget.value,
      });
  }


  getQrCode() {
    let imgdata;
    const errors = this.props.errors.message;
    if (this.props.verified) {
      // return <Redirect to='/profile' />
      return <h1>Your 2FA has been setup</h1>;

    } else {
      return (
        <div className="twofa-container">
          <h1>Please setup Two-Factor Authentication</h1>
          <p>Step 1: Download the Google Authenticator App from your app store or download the plugin <a href="https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai?hl=en">here</a></p>
          <p>Step 2: Scan this QR code with through the Google Authenticator App (look for the plus sign to add this website to your list)</p>
          <p>Step 3: Finally, you will receive a 6-digit token every 30-60 seconds. Use the most recent token below to varify your login</p>
          {qrcode.toDataURL(this.props.otpauth_url, function (err, data) {
            imgdata = data;
            console.log(imgdata);
          })}
          <img src={`${imgdata}`} alt="" />
          <form onSubmit={this.handleSubmit}>
            <input
              className="input input-token"
              type="text"
              value={this.state.token}
              onChange={this.update()}
              placeholder="000000"
            />
            <input className="btn-session" type="submit" value="Submit Token" />
          </form>
          <div>
            <p>{errors ? `${errors}` : ""}</p>
          </div>
        </div>
      );
    }
  }

  render() {
    return <div>{this.getQrCode()}</div>;
  }
}

export default withRouter(TwoFASetup);
