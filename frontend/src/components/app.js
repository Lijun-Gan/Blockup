import React from "react";
import { Route } from "react-router-dom";
import {
  AuthRoute,
  ProtectedRoute,
  TwoFAProtectedRoute,
} from "../util/route_util";
import { Switch } from "react-router-dom";
import NavBarContainer from "./nav/navbar_container";
import TwoFASetupContainer from "./setting/two_fa_setup_container";

import MainPage from "./main/main_page";
import LoginFormContainer from "./session/login_form_container";
import SignupFormContainer from "./session/signup_form_container";
import RoomsContainer from "./rooms/rooms_container";
import FriendshipContainer from "./friendship/friendship_container";
// import WebApp from "./web_app";
import profile_container from "./profile/profile_container";
import VideoContainer from './video_chat/video_chat_container';
import Developers from './meet_developers/developers';
import WebAppContainer from "./web_app_container";

const App = () => (
  <div className="app">
    <NavBarContainer />
    <Switch>
      <Route exact path="/developers" component={Developers}/>
      <AuthRoute exact path="/" component={MainPage} />
      <AuthRoute exact path="/login" component={LoginFormContainer} />
      <AuthRoute exact path="/signup" component={SignupFormContainer} />
      <ProtectedRoute
        exact
        path="/twoFASetup"
        component={TwoFASetupContainer}
      />
      <ProtectedRoute 
      exact
      path="/web"
      component={WebAppContainer}
      />
      <TwoFAProtectedRoute exact path="/friends" component={FriendshipContainer}/>
      <TwoFAProtectedRoute exact path="/video/:roomId/:isVideo" component={VideoContainer}/>
      <TwoFAProtectedRoute exact path="/rooms" component={RoomsContainer} />
      <TwoFAProtectedRoute exact path="/web" component={WebAppContainer} />
      <TwoFAProtectedRoute exact path="/profile" component={profile_container} />
    </Switch>
  </div>
);

export default App;
