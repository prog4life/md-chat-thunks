import { WEBSOCKET_OPEN, WEBSOCKET_CLOSED } from 'constants/actionTypes';
import * as wsKeys from 'constants/websocket-keys';

import {
  addChat,
  receiveTyping,
  receiveMessage,
  handleServerPong,
  sendUnsentMessages,
  stopTypingNotification,
} from 'actions';

// TODO: from 'actions' to avoid circular dependencies; for next 2
import { requestClientId, setClientId, setToken } from './client';
import { joinWallSuccess } from './wall';

let webSocket;

export const getWebsocket = () => webSocket;

// TODO: rename handlers to listeners

// TODO: create websocket middleware

// for removing initial listeners from the outside
const initialWebsocketEventHandlers = {};

export const getInitialWebsocketEventHandler = eventType => (
  initialWebsocketEventHandlers[eventType]
);

export const closeWebsocket = () => {
  webSocket.close();
};

export const websocketOpen = () => ({ type: WEBSOCKET_OPEN });
export const websocketClosed = () => ({ type: WEBSOCKET_CLOSED });

// returns wrapped event listener function
const createMessageEventHandler = (dispatch, getState) => (messageEvent) => {
  const incoming = JSON.parse(messageEvent.data);

  const {
    id, clientId, login, token, chatId, key, nickname, text, participants
  } = incoming;

  switch (key) {
    case wsKeys.IS_TYPING:
      dispatch(receiveTyping(nickname));
      break;
    case wsKeys.MESSAGE:
      dispatch(receiveMessage({ ...incoming, isOwn: false }));
      // to terminate showing typing notification if new message is received
      // from one whose typing notification is showing
      dispatch(stopTypingNotification(nickname));
      break;
    case wsKeys.SET_ID:
      dispatch(setClientId(clientId));
      dispatch(sendUnsentMessages());
      break;
    case wsKeys.SIGN_IN:
      dispatch(setClientId(clientId));
      dispatch(setToken(token));
      break;
    case wsKeys.SIGN_UP:
      dispatch(setClientId(clientId));
      dispatch(setToken(token));
      break;
    case wsKeys.JOIN_WALL:
      console.log('Joined the wall');
      // dispatch(joinWallSuccess(incoming));
      break;
    case wsKeys.PONG:
      handleServerPong();
      break;
    case wsKeys.ADD_CHAT:
      dispatch(addChat(chatId, participants));
      break;
    case wsKeys.CHANGE_NAME:
      break;
    case wsKeys.JOIN_CHAT:
      break;
    case wsKeys.LEAVE_CHAT:
      break;
    default:
      console.warn('Unknown websocket incoming message key');
  }
};

export const createOpenEventHandler = (dispatch, getState) => (openEvent) => {
  const { clientId } = getState();

  console.log('WebSocket OPENED, event: ', openEvent);

  dispatch(websocketOpen());

  if (!clientId) {
    dispatch(requestClientId());
    return;
  }
  // TODO: send hasId
  dispatch(sendUnsentMessages());
};

export const createCloseEventHandler = dispatch => (closeEvent) => {
  // console.log(`Closing wasClean: ${closeEvent.wasClean}`);
  console.log('WebSocket CLOSED, event: ', closeEvent);
  dispatch(websocketClosed());
  // TODO: reopen here ?
};

export const createErrorEventHandler = dispatch => (errorEvent) => {
  console.log('WebSocket ERROR, event: ', errorEvent);

  if (webSocket && webSocket.readyState !== WebSocket.CLOSED) {
    // NOTE: looks like closing will be done by websocket itself in case
    // of connection error
    dispatch(closeWebsocket());
  }
};

export const setupWebsocket = () => (dispatch, getState) => {
  if (webSocket) {
    webSocket.close();
  }

  webSocket = new WebSocket('ws://localhost:8787');

  console.log('WebSocket CONNECTING');

  // will create wrapped into dispatch event listener functions
  // TODO: pass dispatch/getState as arg right into factory function call ?
  const openEventHandler = dispatch(createOpenEventHandler);
  const messageEventHandler = dispatch(createMessageEventHandler);
  const closeEventHandler = dispatch(createCloseEventHandler);
  const errorEventHandler = dispatch(createErrorEventHandler);

  webSocket.addEventListener('open', openEventHandler);
  webSocket.addEventListener('message', messageEventHandler);
  webSocket.addEventListener('close', closeEventHandler);
  webSocket.addEventListener('error', errorEventHandler);

  initialWebsocketEventHandlers.open = openEventHandler;
  initialWebsocketEventHandlers.message = messageEventHandler;
  initialWebsocketEventHandlers.close = closeEventHandler;
  initialWebsocketEventHandlers.error = errorEventHandler;

  return webSocket;
};
