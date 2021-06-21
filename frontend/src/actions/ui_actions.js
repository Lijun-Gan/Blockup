import {showRoom} from "../util/room_api_util"

export const RECEIVE_ACTIVE_ROOM = "RECEIVE_ACTIVE_ROOM";
export const RESET_ACTIVE_ROOM = "RESET_ACTIVE_ROOM";

export const receiveActiveRoom = room => ({
    type: RECEIVE_ACTIVE_ROOM,
    room,
})

export const resetActiveRoom = () => ({
    type: RESET_ACTIVE_ROOM,
})


export const fetchActiveRoom = id => dispatch => {
    return (showRoom(id) 
        .then(room => dispatch(receiveActiveRoom(room.data)))
    )
}