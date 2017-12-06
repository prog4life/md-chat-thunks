import parseJSON from '../utils/json-parser';
import {
  receiveTyping, receiveMessage, setClientId, getClientId, sendUnsent
} from './actions';

let webSocket;
export const getWebsocket = () => webSocket;

// for removing initial listeners from the outside
const initialWebsocketEventHandlers = {};
export const getInitialWebsocketEventHandler = eventName => (
  initialWebsocketEventHandlers[eventName]
);

// returns wrapped event handler function that will be used in listener
export const createMessageEventHandler = (dispatch, getState) => (
  (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
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
          isOwn: getState().clientId === clientId
        }));
        break;
      case 'SET_ID':
        dispatch(setClientId(clientId));
        dispatch(sendUnsent()); // TODO: add condition ?
        break;
      case 'JOIN_CHAT':
        break;
      case 'LEAVE_CHAT':
        break;
      case 'CHANGE_NAME':
        break;
      default:
        console.warn('Unknown websocket incoming message type');
    }
  }
);

export const createOpenEventHandler = (dispatch, getState) => () => {
  dispatch({
    type: 'WEBSOCKET_OPEN',
    status: 'OPEN'
  });

  if (!getState().clientId) {
    dispatch(getClientId());
  } else {
    // TODO: send hasId
    // TODO: add condition ?
    dispatch(sendUnsent());
  }
};

export const createCloseEventHandler = () => dispatch => (closeEvent) => {
  console.log(`Closing wasClean: ${closeEvent.wasClean}`);
  console.log(`Close code: ${closeEvent.code}, reason: ${closeEvent.reason}`);
  dispatch({
    type: 'WEBSOCKET_CLOSED',
    status: 'CLOSED'
  });
  // TODO: reopen
};

export const createErrorEventHandler = (dispatch, getState) => (errorEvent) => {
  console.log(`webSocket Error: ${errorEvent.message}`);
  // TODO: add error message to store ???
  dispatch({
    type: 'WEBSOCKET_ERROR',
    status: 'ERROR'
  });

  if (webSocket && getState().websocketStatus !== 'CLOSED') {
    dispatch({
      type: 'WEBSOCKET_CLOSING',
      status: 'CLOSING'
    });
    webSocket.close();
  }
};

export const setupWebsocket = () => (dispatch, getState) => {
  // TODO: close and reopen new one ?
  const { websocketStatus } = getState();

  if (websocketStatus === 'OPEN' || websocketStatus === 'CONNECTING') {
    console.log('websocketStatus in setupWebSocket: ', websocketStatus);
    return webSocket;
  }

  dispatch({
    type: 'WEBSOCKET_CONNECTING',
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
