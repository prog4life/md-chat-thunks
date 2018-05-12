import { WEBSOCKET_CLOSED } from 'constants/action-types';

import {
  addChat,
  receiveTyping,
  receiveMessage,
  handleServerPong,
  setClientId,
  getClientId,
  sendUnsentMessages,
  stopTypingNotification,
} from './actions';

import { joinWallSuccess } from './publicWall';

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

export const websocketClosed = () => ({ type: WEBSOCKET_CLOSED });

// returns wrapped event listener function
const createMessageEventHandler = (dispatch, getState) => (messageEvent) => {
  const incoming = JSON.parse(messageEvent.data);

  const {
    id, clientId, login, chatId, type, nickname, text, participants
  } = incoming;

  switch (type) {
    case 'IS_TYPING':
      dispatch(receiveTyping(nickname));
      break;
    case 'MESSAGE':
      dispatch(receiveMessage({ ...incoming, isOwn: false }));
      // to terminate showing typing notification if new message is received
      // from one whose typing notification is showing
      dispatch(stopTypingNotification(nickname));
      break;
    case 'SET_ID':
      dispatch(setClientId(clientId));
      dispatch(sendUnsentMessages());
      break;
    case 'SIGN_IN':
      dispatch(setClientId(clientId));
      break;
    case 'SIGN_UP':
      dispatch(setClientId(clientId));
      break;
    case 'JOIN-THE-WALL':
      dispatch(joinWallSuccess(incoming));
      break;
    case 'PONG':
      handleServerPong();
      break;
    case 'ADD_CHAT':
      dispatch(addChat(chatId, participants));
      break;
    case 'CHANGE_NAME':
      break;
    case 'JOIN_CHAT':
      break;
    case 'LEAVE_CHAT':
      break;
    default:
      console.warn('Unknown websocket incoming message type');
  }
};

export const createOpenEventHandler = (dispatch, getState) => (openEvent) => {
  const { clientId } = getState();

  console.log('WebSocket OPENED, event: ', openEvent);

  if (!clientId) {
    dispatch(getClientId());
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
