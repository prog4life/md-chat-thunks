import * as aT from 'constants/actionTypes';
import * as wsKeys from 'constants/websocket-keys';
import {
  addChat, receiveTyping, receiveMessage, handleServerPong, sendUnsentMessages,
  requestClientId, setClientId, setToken, stopTypingNotification,
  websocketOpen, websocketClosed, joinWallSuccess,
} from 'actions';

const websocketMessageHandlers = {
  // SET_ID: ({ clientId }, next) => next(setClientId(clientId)),
  [wsKeys.SIGN_IN]: ({ clientId, token }, next) => {
    next(setClientId(clientId));
    next(setToken(token));
  },
  [wsKeys.SIGN_UP]: ({ clientId, token }, next) => {
    next(setClientId(clientId));
    next(setToken(token));
  },
  [wsKeys.JOIN_WALL]: (incoming, next) => {
    console.log('Joined the wall');
    // next(joinWallSuccess(incoming));
  },
};

const handleIncoming = (incoming, next) => {
  const { key } = incoming; // TODO: check key if it is string

  if (!websocketMessageHandlers.hasOwnProperty(key)) {
    console.warn('Unknown websocket incoming message key');
    return null;
  }
  return websocketMessageHandlers[key](incoming, next);
};

export default handleIncoming;
