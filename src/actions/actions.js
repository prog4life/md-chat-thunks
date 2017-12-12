import shortid from 'shortid';
import {
  SEND_MESSAGE_ATTEMPT,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  RECEIVE_MESSAGE,
  REQUEST_CLIENT_ID,
  SET_CLIENT_ID,
  SET_NICKNAME,
  RECEIVE_TYPING,
  STOP_TYPING_NOTIFICATION
} from 'constants/action-types';

import { tryToSend } from './connection';

export const sendMessageAttempt = ({ id, clientId, nickname, text }) => ({
  type: SEND_MESSAGE_ATTEMPT,
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
  type: SEND_MESSAGE_SUCCESS,
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
  type: SEND_MESSAGE_FAIL,
  message
});

export const receiveMessage = message => ({
  type: RECEIVE_MESSAGE,
  message
});

// export const removeFromUnsent = unsentData => ({
//   type: 'REMOVE_FROM_UNSENT',
//   unsentData
// });

export const requestClientId = () => {
  tryToSend({
    type: 'GET_ID'
  });
  // it's Redux action type, while above type is JSON websocket msg type
  return {
    type: REQUEST_CLIENT_ID
  };
};

export const setClientId = clientId => ({
  type: SET_CLIENT_ID,
  clientId
});

export const setNickname = nickname => ({
  type: SET_NICKNAME,
  nickname
});

export const receiveTyping = nickname => ({
  type: RECEIVE_TYPING,
  nickname
});

export const stopTypingNotification = () => ({
  type: STOP_TYPING_NOTIFICATION
});

// TODO: limit sending to last * messages
export const sendUnsentMessages = () => (dispatch, getState) => {
  const { unsent, clientId, nickname } = getState();

  if (!clientId) {
    dispatch(requestClientId());
    return;
  }

  if (unsent.length < 1) {
    return;
  }

  unsent.forEach((unsentMessage) => {
    const msgToSend = {
      ...unsentMessage,
      clientId: unsentMessage.clientId || clientId,
      nickname: unsentMessage.nickname || nickname
    };
    // if (!unsentMessage.clientId) {
    //   unsentMessage.clientId = clientId;
    // }
    // if (!unsentMessage.nickname) {
    //   unsentMessage.nickname = nickname;
    // }
    dispatch(tryToSend(msgToSend, {
      success: sendMessageSuccess(unsentMessage)
    }));
  });
};

export const sendTyping = (nickname, clientId) => (dispatch) => {
  if (!clientId) {
    dispatch(requestClientId());
    return;
  }

  const outgoingTypingNotification = {
    clientId,
    nickname,
    type: 'IS_TYPING'
  };

  dispatch(tryToSend(outgoingTypingNotification));
};

export const sendMessage = (nickname, text) => (dispatch, getState) => {
  const { clientId, unsent, nickname: existingNickname } = getState();
  const message = {
    id: shortid.generate(),
    // TODO: add timestamp here?
    clientId,
    nickname,
    text,
    type: 'MESSAGE'
  };

  // TODO: replace to component handleSending method - NOT
  if (nickname !== existingNickname) {
    dispatch(setNickname(nickname));
  }
  dispatch(sendMessageAttempt(message));

  if (!clientId) {
    dispatch(sendMessageFail(message));
    dispatch(requestClientId());
    return;
  }

  if (unsent.length > 0) {
    dispatch(sendMessageFail(message));
    dispatch(sendUnsentMessages());
    return;
  }

  dispatch(tryToSend(message, {
    success: sendMessageSuccess(message),
    fail: sendMessageFail(message)
  }));
};
