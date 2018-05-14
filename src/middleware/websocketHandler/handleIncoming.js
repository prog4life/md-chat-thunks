import * as aT from 'constants/actionTypes';
import {
  addChat, receiveTyping, receiveMessage, handleServerPong, sendUnsentMessages,
  requestClientId, setClientId, setToken, stopTypingNotification,
  websocketOpen, websocketClosed, joinWallSuccess,
} from 'actions';

export const createIncomingHandler = typesToHandlersMap => (
  // it will be "handleIncoming"
  (incoming, next) => {
    const { type } = incoming; // TODO: check type if it is string

    if (!typesToHandlersMap.hasOwnProperty(type)) {
      console.warn('Unknown websocket incoming message type');
      return null;
    }
    return typesToHandlersMap[type](incoming, next);
  }
);

export const handleIncoming = createIncomingHandler({
  // SET_ID: ({ clientId }, next) => next(setClientId(clientId)),
  SIGN_IN: ({ clientId, token }, next) => {
    next(setClientId(clientId));
    next(setToken(token));
  },
  SIGN_UP: ({ clientId, token }, next) => {
    next(setClientId(clientId));
    next(setToken(token));
  },
  Join_Wall: (incoming, next) => {
    console.log('Joined the wall');
    // next(joinWallSuccess(incoming));
  },
});
