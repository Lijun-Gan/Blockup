import {
  RECEIVE_CURRENT_USER,
  RECEIVE_USER_LOGOUT,
  RECEIVE_USER_SIGN_IN,
  RECEIVE_IMAGE
} from "../actions/session_actions";

import { RECEIVE_FRIENDSHIPS } from '../actions/friendship_actions'


const initialState = {
  isAuthenticated: false,
  isVerified: false,
  user: {},
};

const SessionAPIReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      
      console.log("SESSION API REDUCER");
      let isAuthenticated = false;
      
      let currentUser = action.currentUser

      if(action.currentUser && action.currentUser._id){
        
        currentUser["id"] = action.currentUser._id
        
        delete currentUser["_id"]
        
      }

      
      if (Object.values(action.currentUser).length > 0) {
        isAuthenticated = true;
      }
      
      return {
        ...state,
        isAuthenticated: isAuthenticated,
        isVerified: action.currentUser.verified,
        user: currentUser,
      };

    case RECEIVE_IMAGE:
      
      return Object.assign({},state,{img_url: action.img_url})
  
    case RECEIVE_USER_LOGOUT:
      return {
        isAuthenticated: false,
        isVerified: false,
        user: undefined,
      };
    case RECEIVE_USER_SIGN_IN:
      
      return {
        ...state,
        isSignedIn: true,
      };

    case RECEIVE_FRIENDSHIPS:
      let friends = []
      let nextState = Object.assign({}, state)

      let current_user = nextState.user.id

      action.friendships.forEach((e)=>{


        if(current_user === e.friend1._id){
          friends.push({id: e.friend2._id, username: e.friend2.username})
        }else{
          friends.push({id: e.friend1._id, username: e.friend1.username})
        }

      })
      nextState.user["friends"] = friends 

      return nextState


    default:
      return state;
  }
};

export default SessionAPIReducer;
