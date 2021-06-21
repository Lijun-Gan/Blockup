
import * as FriendshipApiUtil from "./../util/friendship_api_util";

export const RECEIVE_FRIEND_REQUEST = "RECEIVE_FRIEND_REQUEST";
export const RECEIVE_FRIEND_REQUESTS = "RECEIVE_FRIEND_REQUESTS";
export const RECEIVE_FRIENDSHIP = "RECEIVE_FRIENDSHIP";
export const RECEIVE_FRIENDSHIPS = "RECEIVE_FRIENDSHIPS";
export const DELETE_FRIENDSHIP = "DELETE_FRIENDSHIP";
export const DELETE_FRIEND_REQUEST = "DELETE_FRIEND_REQUEST";

export const receiveFriendRequest = friendRequest => {
    return ({
        type: RECEIVE_FRIEND_REQUEST,
        friendRequest
    })
};

export const receiveFriendRequests = friendRequests => {
    return ({
        type: RECEIVE_FRIEND_REQUESTS,
        friendRequests
    })
};

export const receiveFriendship = friendship => {
    return ({
        type: RECEIVE_FRIENDSHIP,
        friendship
    })
};

export const receiveFriendships = friendships => {
    return ({
        type: RECEIVE_FRIENDSHIPS,
        friendships
    })
};
export const deleteFriend = friendship => {
    return ({
        type: DELETE_FRIENDSHIP,
        friendship
    })
};
export const deleteRequest = friendRequest => {
    return ({
        type: DELETE_FRIEND_REQUEST,
        friendRequest
    })
};

export const fetchFriendships = friend_id => dispatch => {
    return (
        FriendshipApiUtil.fetchFriendships(friend_id)
        .then(friendships => {
            dispatch(receiveFriendships(friendships.data))
        })
    )
}

export const fetchFriendRequests = friend_id => dispatch => {
    return (
        FriendshipApiUtil.fetchFriendRequests(friend_id)
        .then(friendRequests => {
            dispatch(receiveFriendRequests(friendRequests.data))
        })
    )
}


export const createFriendship = friendship => dispatch => {
    return (
        FriendshipApiUtil.createFriendship(friendship)
        .then(friendship => dispatch(receiveFriendship(friendship.data)))
    )
}

export const makeFriendRequest = friendRequest => dispatch => {
    return (
        FriendshipApiUtil.makeFriendRequest(friendRequest)
        .then(friendRequest => dispatch(receiveFriendRequest(friendRequest.data)))
    )
}

export const deleteFriendRequest = friendRequest_id => dispatch => {
    return (
        FriendshipApiUtil.deleteFriendRequest(friendRequest_id)
        .then(friendRequest => dispatch(deleteRequest(friendRequest.data)))
    )
}
export const deleteFriendship = friendship_id => dispatch => {
    return (
        FriendshipApiUtil.deleteFriendship(friendship_id)
        .then(friendship => dispatch(deleteFriend(friendship.data)))
    )
}



