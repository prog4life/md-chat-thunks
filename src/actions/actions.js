import shortid from 'shortid';
import parseJSON from '../utils/json-parser';
// NOTE: alternatively store it in App component and pass to thunks
let webSocket;

// shortid.generate()

export const getWebsocketInstance = () => webSocket;

export const sendMessageAttempt = ({ id, clientId, nickname, text }) => ({
  type: 'SEND_MESSAGE_ATTEMPT',
  message: {
    id,
    clientId,
    nickname,
    text,
    isOwn: true,
    status: 'UNSENT'
  }
});

export const sendMessageSuccess = ({ id, clientId, nickname, text }) => ({
  type: 'SEND_MESSAGE_SUCCESS',
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
  type: 'SEND_MESSAGE_FAIL',
  message
});

// TODO: to terminate displaying of typing notification if new message
// from same one is received
export const receiveMessage = message => ({
  type: 'RECEIVE_MESSAGE',
  message
});

export const removeFromUnsent = unsentData => ({
  type: 'REMOVE_FROM_UNSENT',
  unsentData
});

export const clearUnsent = () => ({
  type: 'CLEAR_UNSENT'
});

export const getClientId = () => {
  webSocket.send(JSON.stringify({
    type: 'GET_ID'
  }));
  // it's Redux action type, while above type is JSON websocket msg type
  return {
    type: 'GET_CLIENT_ID'
  };
};

// TODO: need to check and send stored unsent data after receiving of new id
export const setClientId = clientId => ({
  type: 'SET_CLIENT_ID',
  clientId
});

export const setNickname = nickname => ({
  type: 'SET_NICKNAME',
  nickname
});

export const receiveTyping = nickname => ({
  type: 'RECEIVE_TYPING',
  nickname
});

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
  webSocket.onopen = () => {
    dispatch({
      type: 'WEBSOCKET_OPEN',
      status: 'OPEN'
    });
    // TODO: request clientId
    if (!getState().clientId) {
      dispatch(getClientId());
    }
    // TODO: send hasId and unsent data
  };
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

// NOTE: Possibly excess
export const checkWebsocketAndClientId = ({ websocketStatus, clientId }) => (
  websocketStatus === 'OPEN' && clientId
);

export const prepareWebsocketAndClientId = () => (dispatch, getState) => {
  const { websocketStatus, clientId } = getState();

  if (websocketStatus !== 'OPEN' && websocketStatus !== 'CONNECTING') {
    return dispatch(setupWebsocket());
  }

  if (!clientId) {
    // TODO: return clientId or not ???
    return dispatch(getClientId());
  }
  return true;
};

export const sendMessage = (nickname, text) => (dispatch, getState) => {
  const { websocketStatus, clientId } = getState();
  const message = {
    id: shortid.generate(),
    // TODO: add timestamp here?
    clientId,
    nickname,
    text
  };

  // TODO: replace to component handleSending method
  dispatch(setNickname(nickname));
  dispatch(sendMessageAttempt(message));

  if (websocketStatus === 'OPEN' && clientId) {
    dispatch(sendMessageSuccess(message));
    message.type = 'MESSAGE';
    webSocket.send(JSON.stringify(message));
  } else {
    // TODO: replace next one with postponeSending
    dispatch(sendMessageFail(message));
    dispatch(prepareWebsocketAndClientId());
  }
};
