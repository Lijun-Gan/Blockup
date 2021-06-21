
import { RECEIVE_FRIENDSHIP, RECEIVE_FRIENDSHIPS,DELETE_FRIENDSHIP } from '../actions/friendship_actions'

const friendshipReducer = (state = {} , action) => {
    Object.freeze(state);
    let nextState = Object.assign({}, state);

    switch(action.type){
        case RECEIVE_FRIENDSHIPS:

            // action.friendships.forEach((e)=>{
            //     let {friend1, friend2 , _id} = e
            //     nextState[e._id] = {friend1, friend2 , _id}
            // })
            // return nextState;

            let b = {}
        
            action.friendships.forEach((e)=>{
                let {friend1, friend2 , _id} = e
                b[e._id] = {friend1, friend2 , _id}
            })

            // return Object.assign({}, action.friendships)
            return b

        case RECEIVE_FRIENDSHIP:
            
            let {friend1, friend2 , _id} = action.friendship
            nextState[action.friendship._id] = {friend1, friend2 , _id}
            
            return nextState

        case DELETE_FRIENDSHIP:
            delete nextState[action.friendship._id]
            return nextState

        default:
            return state
    }
}

export default friendshipReducer