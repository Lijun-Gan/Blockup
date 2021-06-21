import * as MessageApiUtil from "./../util/message_api_util";

export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
export const RECEIVE_ROOM_MESSAGE = "RECEIVE_ROOM_MESSAGE";
export const RECEIVE_ROOM_MESSAGES = "RECEIVE_ROOM_MESSAGES";

export const receiveMessage = (message) => {
  return {
    type: RECEIVE_MESSAGE,
    message,
  };
};

export const receiveRoomMessage = (message) => {
  return {
    type: RECEIVE_ROOM_MESSAGE,
    message,
  };
};

export const receiveRoomMessages = (messages) => {
  return {
    type: RECEIVE_ROOM_MESSAGES,
    messages,
  };
};

export const fetchMessage = (messageId) => (dispatch) => {
  return MessageApiUtil.fetchMessage(messageId).then((message) =>
    dispatch(receiveMessage(message))
  );
};

export const fetchRoomMessage = (messageId) => (dispatch) => {
  return MessageApiUtil.fetchMessage(messageId).then((message) =>
    dispatch(receiveRoomMessage(message))
  );
};

export const fetchRoomMessages = (roomId) => (dispatch) => {
  return MessageApiUtil.fetchRoomMessages(roomId).then((messages) =>
    dispatch(receiveRoomMessages(messages.data))
  );
};

export const createMessage = (message) => (dispatch) => {
  return MessageApiUtil.createMessage(message).then((message) =>
    dispatch(receiveMessage(message.data))
  );
};
