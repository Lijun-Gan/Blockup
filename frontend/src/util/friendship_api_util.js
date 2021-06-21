import axios from 'axios';

export const fetchFriendships = (friend_id) => {
    return axios.get(`/api/friendships/${friend_id}`)

}
export const fetchFriendRequests = (friend_id) => {
    return axios.get(`/api/friendRequests/${friend_id}`)
}

export const createFriendship = (friendship) =>{
    return axios.post('/api/friendships/new',friendship)
}
export const makeFriendRequest = (friendRequest) =>{
    return axios.post('/api/friendRequests/new',friendRequest)
} 

export const deleteFriendship = (friendship_id) => {
    return axios.delete(`/api/friendships/delete/${friendship_id}`)
}
export const deleteFriendRequest = (friendRequest_id) => {
    return axios.delete(`/api/friendRequests/delete/${friendRequest_id}`)
}
