import {
  WEBSOCKET_CLOSING,
  WEBSOCKET_OPEN,
  WEBSOCKET_CLOSED,
  WEBSOCKET_ERROR,
  WEBSOCKET_CONNECTING
} from 'constants/action-types';

import {
  receiveTyping,
  receiveMessage,
  pong,
  setClientId,
  requestClientId,
  sendUnsentMessages,
  stopTypingNotification
} from 'actions';

let webSocket;
export const getWebsocket = () => webSocket;

// for removing initial listeners from the outside
const initialWebsocketEventHandlers = {};
export const getInitialWebsocketEventHandler = eventName => (
  initialWebsocketEventHandlers[eventName]
);

export const closeWebsocket = () => {
  webSocket.close();
  return {
    type: WEBSOCKET_CLOSING,
    status: 'CLOSING'
  };
};

// returns wrapped event handler function that will be used in listener
const createMessageEventHandler = (dispatch, getState) => (messageEvent) => {
  // TODO: start sending "unsent" from here too ?
  const incoming = JSON.parse(messageEvent.data);

  const {
    clientId, type, nickname, text
  } = incoming;

  switch (type) {
    case 'IS_TYPING':
      dispatch(receiveTyping(nickname));
      break;
    case 'MESSAGE':
      dispatch(receiveMessage({
        clientId,
        nickname,
        text,
        isOwn: false
      }));
      // to terminate showing typing notification if new message is received
      // from one whose typing notification is showing
      if (getState().whoIsTyping === nickname) {
        dispatch(stopTypingNotification());
      }
      break;
    case 'SET_ID':
      dispatch(setClientId(clientId));
      dispatch(sendUnsentMessages());
      break;
    case 'PONG':
      dispatch(pong());
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
  const { clientId, unsent } = getState();
  dispatch({
    type: WEBSOCKET_OPEN,
    status: 'OPEN'
  });

  // TODO: send PING if did not dispatch REOPENING and set heartbeat as true
  // in ping interval func
  // webSocket.send(JSON.stringify({
  //   type: 'PING'
  // }));

  if (!clientId) {
    dispatch(requestClientId());
    return;
  }
  // TODO: send hasId
  dispatch(sendUnsentMessages());
};

export const createCloseEventHandler = dispatch => (closeEvent) => {
  // console.log(`Closing wasClean: ${closeEvent.wasClean}`);
  console.log('webSocket close event: ', closeEvent);
  dispatch({
    type: WEBSOCKET_CLOSED,
    status: 'CLOSED'
  });
  // TODO: reopen ?
};

export const createErrorEventHandler = dispatch => (errorEvent) => {
  console.log('webSocket error event: ', errorEvent);
  dispatch({
    type: WEBSOCKET_ERROR,
    status: 'ERROR'
  });

  if (webSocket && webSocket.readyState !== WebSocket.CLOSED) {
    // NOTE: looks like closing will be done by websocket itself in case
    // of connection error
    dispatch(closeWebsocket());
  }
};

export const setupWebsocket = () => (dispatch) => {
  if (webSocket) {
    webSocket.close();
  }

  dispatch({
    type: WEBSOCKET_CONNECTING,
    status: 'CONNECTING'
  });
  webSocket = new WebSocket('ws://localhost:8787');

  // dispatching thunk that returns wrapped event handler function
  const openEventHandler = dispatch(createOpenEventHandler);
  const messageEventHandler = dispatch(createMessageEventHandler);
  const closeEventHandler = dispatch(createCloseEventHandler);
  const errorEventHandler = dispatch(createErrorEventHandler);

  webSocket.addEventListener('open', openEventHandler);
  webSocket.addEventListener('message', messageEventHandler);
  webSocket.addEventListener('close', closeEventHandler);
  webSocket.addEventListener('error', errorEventHandler);

  initialWebsocketEventHandlers.openEventHandler = openEventHandler;
  initialWebsocketEventHandlers.messageEventHandler = messageEventHandler;
  initialWebsocketEventHandlers.closeEventHandler = closeEventHandler;
  initialWebsocketEventHandlers.errorEventHandler = errorEventHandler;

  return webSocket;
};

export { createMessageEventHandler };
