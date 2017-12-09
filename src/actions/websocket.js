import parseJSON from '../utils/json-parser';
import {
  receiveTyping,
  receiveMessage,
  setClientId,
  getClientId,
  sendUnsent,
  stopTypingNotification
} from './actions';

const MONITORING_INTRVL = 5000;

let webSocket;
export const getWebsocket = () => webSocket;

// for removing initial listeners from the outside
const initialWebsocketEventHandlers = {};
export const getInitialWebsocketEventHandler = eventName => (
  initialWebsocketEventHandlers[eventName]
);

export const startPing = (dispatch, getState) => {
  const monitoringIntervalId = setInterval(() => {
    if (getState().connectionMonitoring.heartbeat === false) {
      // admit heartbeat as true for single next check
      dispatch({
        type: 'REOPENING',
        heartbeat: true
      });
      this.setupWebSocket();
      return;
    }
    dispatch({
      type: 'PING',
      heartbeat: false
    });
    webSocket.send(JSON.stringify({
      type: 'PING'
    }));
  }, MONITORING_INTRVL);

  return {
    type: 'START_PING',
    monitoringIntervalId,
    heartbeat: true
  };
};

export const stopPing = (intervalId) => {
  clearInterval(intervalId);
  return {
    type: 'STOP_PING',
    intervalId
  };
};

// returns wrapped event handler function that will be used in listener
const createMessageEventHandler = (dispatch, getState) => (messageEvent) => {
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
        isOwn: false
      }));
      // to terminate displaying of typing notification if new message
      // from same one is received
      if (getState().whoIsTyping === nickname) {
        dispatch(stopTypingNotification());
      }
      break;
    case 'SET_ID':
      dispatch(setClientId(clientId));
      dispatch(sendUnsent()); // TODO: add condition ?
      break;
    case 'PONG':
      break;
    case 'JOIN_CHAT':
      break;
    case 'LEAVE_CHAT':
      break;
    default:
      console.warn('Unknown websocket incoming message type');
  }
};

export const createOpenEventHandler = (dispatch, getState) => () => {
  dispatch({
    type: 'WEBSOCKET_OPEN',
    status: 'OPEN'
  });

  // TODO: send PING if did not dispatch REOPENING and set heartbeat as true
  // in ping interval func
  // webSocket.send(JSON.stringify({
  //   type: 'PING'
  // }));

  if (!getState().clientId) {
    dispatch(getClientId());
  } else {
    // TODO: send hasId
    // TODO: add condition ?
    dispatch(sendUnsent());
  }
};

export const createCloseEventHandler = dispatch => (closeEvent) => {
  console.log(`Closing wasClean: ${closeEvent.wasClean}`);
  console.log(`Close code: ${closeEvent.code}, reason: ${closeEvent.reason}`);
  dispatch({
    type: 'WEBSOCKET_CLOSED',
    status: 'CLOSED'
  });
  // TODO: reopen ?
};

export const createErrorEventHandler = dispatch => (errorEvent) => {
  console.log(`webSocket Error: ${errorEvent.message}`);
  // TODO: add error message to store ???
  dispatch({
    type: 'WEBSOCKET_ERROR',
    status: 'ERROR'
  });

  if (webSocket && webSocket.readyState !== WebSocket.CLOSED) {
    dispatch({
      type: 'WEBSOCKET_CLOSING',
      status: 'CLOSING'
    });
    // TODO: looks like closing will be done by websocket itself in case
    // of connection error
    webSocket.close();
  }
};

export const setupWebsocket = () => (dispatch) => {
  // NOTE: can be unreliable, so reopen anyway
  // if (webSocket.readyState === 1 || webSocket.readyState === 0) {
  //   return webSocket;
  // }

  if (webSocket) {
    webSocket.close();
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

export { createMessageEventHandler };
