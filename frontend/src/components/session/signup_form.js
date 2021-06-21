import React from "react";
import { withRouter } from "react-router-dom";

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      password2: "",
      errors: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearedErrors = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signedIn === true) {
      this.props.history.push("/login");
    }

    this.setState({ errors: nextProps.errors });
  }

  update(field) {
    return (e) =>
      this.setState({
        [field]: e.currentTarget.value,
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    let user = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2,
    };

    this.props.signup(user).then(()=>{

      this.props.login({email: this.state.email,password: this.state.password})
    });
  }

  handleDemoUser(user){

    return()=>{

      if(user.length === 1){
        this.props.login(user[0])

      }else{

        this.props.login(user[1]).then(()=>{
  
          window.open(window.location.href, "newWindow", "width=900, height=800, top=0 left=600")
          setTimeout(() => {
            this.props.logout()
            this.props.login(user[0])
            // this.props.login(user[0]).then(this.props.history.push("/profile"))
          }, 1000);
  
          
        })

      }
    }

  }

  renderErrors() {
    return (
      <ul>
        {Object.keys(this.state.errors).map((error, i) => (
          <li key={`error-${i}`}>{this.state.errors[error]}</li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div>
        <div className="demo-users">
          <p>Log in as: </p>

          <button className="demouser1" onClick={this.handleDemoUser([{email: "demo_user1@gmail.com", password: "aaaaaa"}])}>demo_user_1</button>
          <p className="or">or</p>
          <button className="demouser2" onClick={this.handleDemoUser([{email: "demo_user2@gmail.com",password: "aaaaaa"}])}>demo_user_2</button>
          <br></br>
          <p>Log in above two accounts at the same time: </p>
          <button className="two-accounts" onClick={this.handleDemoUser([{email: "demo_user1@gmail.com", password: "aaaaaa"},{email: "demo_user2@gmail.com",password: "aaaaaa"}])}>Click</button>

          <p className="login-noti">Note: Logging in with above two accounts at the same time, the original window will load webpage logged in as demo_user_1 and a new pop-up windown will load webpage logged in as demo_user_2. </p>

        </div>

        <div className="signup-form-container">
    
          <div className="slogan">
            <h3>Why use Blockup?</h3>
            <p>
              You get the peace of mind
              <br /> knowing your messages are safe,
              <br />
              while bots, are Blocked Up
            </p>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="signup-form">
              <input
                type="text"
                value={this.state.email}
                onChange={this.update("email")}
                placeholder="Email"
                className="input"
              />
              <input
                type="text"
                value={this.state.username}
                onChange={this.update("username")}
                placeholder="Username"
                className="input"
              />
              <input
                type="password"
                value={this.state.password}
                onChange={this.update("password")}
                placeholder="Password"
                className="input"
              />
              <input
                type="password"
                value={this.state.password2}
                onChange={this.update("password2")}
                placeholder="Confirm Password"
                className="input"
              />
              <button type="submit" className="btn-session">
                Register
              </button>
              <div className="error-msg">{this.renderErrors()}</div>
            </div>
          </form>
        </div>
        <p className="login-noti">Note: If you log in without Two-Factor Authentication, you are only able to ask Blockup Assistant for help, or have conversations with Blockup developers. In order to continue using other functionalities, you have to set up your Two-Factor Authentication. A friend request received from Blockup1 and a friend request sent to Blockup2 will show up on your friends page after loging in your account with Two-Factor Authentication. </p>
      </div>
    );
  }
}

export default withRouter(SignupForm);
