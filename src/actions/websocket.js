import parseJSON from '../utils/json-parser';
import {
  receiveTyping, receiveMessage, setClientId, getClientId, sendUnsent
} from './actions';

let webSocket;

export const getWebsocket = () => webSocket;

export const listenWebsocketMessage = () => (dispatch, getState) => {
  webSocket.addEventListener('message', (messageEvent) => {
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
  });
};

export const listenWebsocketError = () => (dispatch) => {
  webSocket.addEventListener('error', (error) => {
    console.log(`webSocket Error: ${error.message}`);
    // TODO: add error message to store ???
    dispatch({
      type: 'WEBSOCKET_ERROR',
      status: 'ERROR'
    });
    // TODO: close
    if (webSocket && webSocket.websocketStatus !== WebSocket.CLOSED) {
      dispatch({
        type: 'WEBSOCKET_CLOSING',
        status: 'CLOSING'
      });
      webSocket.close();
    }
  });
};

export const listenWebsocketClose = () => (dispatch) => {
  webSocket.addEventListener('close', (event) => {
    console.log(`Closing wasClean: ${event.wasClean}`);
    console.log(`Close code: ${event.code}, reason: ${event.reason}`);
    dispatch({
      type: 'WEBSOCKET_CLOSED',
      status: 'CLOSED'
    });
    // TODO: reopen
  });
};

export const listenWebsocketOpen = () => (dispatch, getState) => {
  webSocket.addEventListener('open', (event) => {
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
  });
};

export const setupWebsocket = () => (dispatch, getState) => {
  // TODO: replace next check out from here ?
  const { websocketStatus } = getState();
  if (websocketStatus === 'OPEN' || websocketStatus === 'CONNECTING') {
    console.log('websocketStatus in setupWebSocket: ', websocketStatus);
    // this.websocket.close(1000, 'New connection opening is started');
    return webSocket;
  }

  dispatch({
    type: 'WEBSOCKET_CONNECTING',
    status: 'CONNECTING'
  });
  webSocket = new WebSocket('ws://localhost:8787');

  dispatch(listenWebsocketOpen());
  dispatch(listenWebsocketMessage());
  dispatch(listenWebsocketClose());
  dispatch(listenWebsocketError());
  return webSocket;
};
