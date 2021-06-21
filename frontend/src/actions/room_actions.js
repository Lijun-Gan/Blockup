import { createRoom, deleteRoom, getUserRooms, showRoom } from "../util/room_api_util";
import { receiveActiveRoom } from "../actions/ui_actions"

export const RECEIVE_NEW_ROOM = "RECEIVE_NEW_ROOM";
export const RECEIVE_ROOMS = "RECEIVE_ROOMS";
export const RECEIVE_SINGLE_ROOM = "RECEIVE_SINGLE_ROOM";
export const RECEIVE_ROOM_ERROR = "RECEIVE_ROOM_ERROR";
export const DELETE_ROOM = "DELETE_ROOM";

export const receiveNewRoom = room => ({
    type: RECEIVE_NEW_ROOM,
    room,
})

export const receiveRooms = rooms => ({
    type: RECEIVE_ROOMS,
    rooms
})

export const receiveSingleRoom = room => ({
    type: RECEIVE_SINGLE_ROOM,
    room
})

export const receiveError = error => ({
    type: RECEIVE_ROOM_ERROR,
    error
})

export const deleteThisRoom = room => ({
    type: DELETE_ROOM,
    room
})

export const composeRoom = data => dispatch => {
    
    return (createRoom(data)
        .then(room => { 
            
            dispatch(receiveNewRoom(room.data))
            dispatch(receiveActiveRoom(room.data))
        
        })
        // .catch(err => {
        //     
        //     console.log(err)
        //     }
        //   )
        )
};

export const fetchSingleRoom = id => dispatch => {
    return (showRoom(id)
        .then(room => dispatch(receiveSingleRoom(room))))
}

export const fetchUserRooms = id => dispatch => (
    getUserRooms(id)
        .then(rooms => { dispatch(receiveRooms(rooms.data))})
);

export const deleteUserRoom = id => dispatch => (
    deleteRoom(id)
    .then(room => dispatch(deleteThisRoom(room.data)))
)