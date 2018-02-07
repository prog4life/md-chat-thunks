import shortid from 'shortid';
import {
  SEND_MESSAGE_ATTEMPT,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  RECEIVE_MESSAGE,
  GET_CLIENT_ID,
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

// will add message to unsent
export const sendMessageFail = message => ({
  type: SEND_MESSAGE_FAIL,
  message
});

export const receiveMessage = message => ({
  type: RECEIVE_MESSAGE,
  message
});

export const addChat = (chatId, participants) => ({
  type: 'ADD_CHAT',
  chatId,
  participants
});

export const deleteChat = (chatId, clientId) => {
  const outgoing = {
    type: 'DELETE_CHAT',
    chatId,
    clientId
  };

  // TODO: add 3rd arg with action that postpones chat deleting command
  tryToSend(outgoing, true);

  return {
    type: 'DELETE_CHAT',
    chatId
  };
};

export const getClientId = () => (dispatch) => {
  const outgoing = { type: 'GET_ID' };
  dispatch(tryToSend(outgoing, true));
  // TODO: check if it works
  return {
    type: GET_CLIENT_ID
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

// TODO: track one who is typing by clientId
export const stopTypingNotification = nickname => ({
  type: STOP_TYPING_NOTIFICATION,
  nickname
});

// TODO: limit sending to last * messages ?
// TODO: consider complete removing unsent array from store and iterating over
// messages and checking their statuses instead
export const sendUnsentMessages = () => (dispatch, getState) => {
  const { unsent } = getState();

  if (unsent.length < 1) {
    return;
  }

  unsent.forEach((unsentMessage) => {
    dispatch(tryToSend(unsentMessage, true, {
      successAction: sendMessageSuccess(unsentMessage)
    }));
  });
};

export const sendTyping = (nickname, clientId) => (dispatch) => {
  if (!clientId) {
    dispatch(getClientId());
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

  dispatch(tryToSend(outgoing, false));
};

export const sendMessage = text => (dispatch, getState) => {
  const { clientId, unsent, nickname } = getState();
  const message = {
    id: shortid.generate(),
    // TODO: add timestamp here?
    clientId,
    nickname,
    text,
    type: 'MESSAGE'
  };

  // TEMP: replace it later to connected ChatForm or elsewhere,
  // TODO: dispatch CHANGE_NICKNAME action, and send notification
  // if (nickname !== existingNickname) {
  //   dispatch(setNickname(nickname));
  // }

  dispatch(sendMessageAttempt(message));

  if (!clientId) {
    dispatch(sendMessageFail(message));
    dispatch(getClientId());
    return;
  }

  if (unsent.length > 0) {
    // TODO: create additional action, something like POSTPONE_SENDING ?
    dispatch(sendMessageFail(message)); // to postpone sending
    dispatch(sendUnsentMessages());
    return;
  }

  dispatch(tryToSend(message, true, {
    successAction: sendMessageSuccess(message),
    failAction: sendMessageFail(message)
  }));
};
