import axios from 'axios';

export const fetchMessage = messageId => {
  return axios.get(`/api/messages/${messageId}`)
};

export const fetchRoomMessages = roomId => {
  return axios.get(`/api/messages/room/${roomId}`)
};

export const createMessage = data => {
  return axios.post('/api/messages/new', data)
}