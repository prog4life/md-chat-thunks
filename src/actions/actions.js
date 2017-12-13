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

export const requestClientId = () => (dispatch) => {
  const outgoing = { type: 'GET_ID' };
  dispatch(tryToSend({ outgoing }));
  // it's Redux action type, while above type is JSON websocket msg type
  dispatch({
    type: REQUEST_CLIENT_ID
  });
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
// TODO: consider complete removing unsent array from store by iterating over
// messages and checking their status
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
    const outgoing = {
      ...unsentMessage,
      clientId: unsentMessage.clientId || clientId,
      nickname: unsentMessage.nickname || nickname
    };

    dispatch(tryToSend({
      outgoing,
      actions: {
        success: sendMessageSuccess(outgoing)
      }
    }));
  });
};

export const sendTyping = (nickname, clientId) => (dispatch) => {
  if (!clientId) {
    dispatch(requestClientId());
    return;
  }

  if (!nickname || nickname.length < 2) {
    return;
  }

  const outgoing = {
    clientId,
    nickname,
    type: 'IS_TYPING'
  };

  dispatch(tryToSend({ outgoing }));
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

  // TEMP replace it later to connected ChatInput or elsewhere,
  // TODO: dispatch CHANGE_NICKNAME action, and send notification
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

  dispatch(tryToSend({
    outgoing: message,
    actions: {
      success: sendMessageSuccess(message),
      fail: sendMessageFail(message)
    }
  }));
};
