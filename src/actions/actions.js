import shortid from 'shortid';
import { tryToSend } from './connection';

export const sendMessageAttempt = ({ id, clientId, nickname, text }) => ({
  type: 'SEND_MESSAGE_ATTEMPT',
  message: {
    id,
    clientId,
    nickname,
    text,
    isOwn: true,
    status: 'UNSENT'
  }
});

// will also remove message from unsent
export const sendMessageSuccess = ({ id, clientId, nickname, text }) => ({
  type: 'SEND_MESSAGE_SUCCESS',
  message: {
    id,
    clientId,
    nickname,
    text,
    isOwn: true,
    // TODO: think over adding 3 separate boolean props: sent, delivered, seen
    status: 'SENT'
  }
});

export const sendMessageFail = message => ({
  type: 'SEND_MESSAGE_FAIL',
  message
});

export const receiveMessage = message => ({
  type: 'RECEIVE_MESSAGE',
  message
});

export const removeFromUnsent = unsentData => ({
  type: 'REMOVE_FROM_UNSENT',
  unsentData
});

export const clearUnsent = () => ({
  type: 'CLEAR_UNSENT'
});

export const getClientId = (webSocket) => {
  webSocket.send(JSON.stringify({
    type: 'GET_ID'
  }));
  // it's Redux action type, while above type is JSON websocket msg type
  return {
    type: 'GET_CLIENT_ID'
  };
};

export const setClientId = clientId => ({
  type: 'SET_CLIENT_ID',
  clientId
});

export const setNickname = nickname => ({
  type: 'SET_NICKNAME',
  nickname
});

export const receiveTyping = nickname => ({
  type: 'RECEIVE_TYPING',
  nickname
});

export const stopTypingNotification = () => ({
  type: 'STOP_TYPING_NOTIFICATION'
});

export const sendUnsent = () => (dispatch, getState) => {
  const { unsent } = getState();

  unsent.forEach((unsentItem) => {
    // if (dispatch(tryToSend(unsentItem))) {
    //   dispatch(sendMessageSuccess(unsentItem));
    //   // dispatch(removeFromUnsent(unsentItem));
    // }
    dispatch(tryToSend(unsentItem, {
      success: sendMessageSuccess(unsentItem)
    }));
  });
};

export const sendTyping = (dispatch, getState) => {
  const { clientId, nickname } = getState();
  const outgoingTypingNotification = {
    clientId,
    nickname,
    type: 'IS_TYPING'
  };
  dispatch(tryToSend(outgoingTypingNotification));
};

export const sendMessage = (nickname, text) => (dispatch, getState) => {
  const { clientId } = getState();
  const message = {
    id: shortid.generate(),
    // TODO: add timestamp here?
    clientId,
    nickname,
    text,
    type: 'MESSAGE'
  };

  // TODO: replace to component handleSending method - NOT
  dispatch(setNickname(nickname));
  dispatch(sendMessageAttempt(message));

  // // TODO: replace by tryToSend
  // const ws = getWebsocket();
  // if (ws.readyState === WebSocket.OPEN && clientId) {
  //   ws.send(JSON.stringify(message));
  //   dispatch(sendMessageSuccess(message));
  // } else {
  //   dispatch(sendMessageFail(message));
  //   dispatch(prepareWebsocketAndClientId);
  // }
  //
  // const onFailAction = sendMessageFail(message);
  //
  // if (dispatch(tryToSend(message, onFailAction))) {
  //
  //   dispatch(sendMessageSuccess(message));
  // } else {
  //   // TODO: replace next one with postponeSending
  //   dispatch();
  // }

  dispatch(tryToSend(message, {
    success: sendMessageSuccess(message),
    fail: sendMessageFail(message)
  }));
};
