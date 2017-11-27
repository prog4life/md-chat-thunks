import parseJSON from '../utils/json-parser';
// NOTE: alternatively store it in App component and pass to thunks
let webSocket;

const WS_CLOSED = 'CLOSED';
const WS_OPEN = 'OPEN';

export const getWebsocketInstance = () => webSocket;

export const addMessage = message => ({
  type: 'MESSAGE_ADD',
  message
});

export const addToUnsent = data => ({
  type: 'UNSENT_ADD',
  data
});

export const clearUnsent = () => ({
  type: 'UNSENT_CLEAR'
});

export const requestNewId = () => {
  webSocket.send(JSON.stringify({
    type: 'GET_ID'
  }));
  // next type is Redux action type, when above type is JSON websocket msg type
  return {
    type: 'CLIENT_ID_REQUESTED'
  };
};

export const listenWebsocketMessage = () => (dispatch) => {
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
        dispatch({ type: 'TYPING_OCCURS', nickname });
        break;
      case 'MESSAGE':
        dispatch({
          type: 'MESSAGE_RECEIVED',
          message: {
            clientId,
            nickname,
            text
          }
        });
        // TODO: append dispatch(addMessage(msg)) ?
        break;
      case 'SET_ID':
        dispatch({ type: 'CLIENT_ID_RECEIVED', clientId });
        break;
      case 'JOIN_CHAT':
        break;
      case 'LEAVE_CHAT':
        break;
      case 'CHANGE_NAME':
        break;
      default:
        console.warn('Unknown websocket message type, default case has fired');
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
      status: WS_CLOSED
    });
    // TODO: reopen
  });
};

export const listenWebsocketOpen = () => (dispatch, getState) => {
  webSocket.onopen = () => {
    dispatch({
      type: 'WEBSOCKET_OPEN',
      status: WS_OPEN
    });
    // TODO: request clientId
    if (!getState().clientId) {
      dispatch(requestNewId());
    }
  };
};

export const setupWebsocket = () => (dispatch, getState) => {
  // TODO: replace next check out from here
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

export const checkWebsocketAndClientId = () => (dispatch, getState) => {
  const { websocketStatus, clientId } = getState();

  return websocketStatus === 'OPEN' && clientId;
};

export const prepareWebsocketAndClientId = () => (dispatch, getState) => {
  const { websocketStatus, clientId } = getState();

  if (websocketStatus !== 'OPEN' && websocketStatus !== 'CONNECTING') {
    return dispatch(setupWebsocket());
  }

  if (!clientId) {
    // TODO: return clientId or not ???
    return dispatch(requestNewId());
  }
  return true;
};

export const sendAndShowMessage = (nickname, text) => (dispatch, getState) => {
  const { clientId } = getState();
  const message = {
    // TODO: add shortid (or timestamp in millisecs) here
    clientId: clientId || null,
    nickname,
    text,
    type: 'MESSAGE', // NOTE: why I add this ???
    status: 'UNSENT'
  };

  // TODO: add nickname to store

  if (dispatch(checkWebsocketAndClientId())) {
    message.status = 'SENT';
    // TODO: extract separate action creator ?
    webSocket.send(message);
    dispatch({ type: 'MESSAGE_SENT' }); // NOTE: probably unnecessary
  } else {
    dispatch(addToUnsent(message));
    dispatch(prepareWebsocketAndClientId());
  }
  // TODO: add "own" {Boolean} property
  message.nickname = 'Me';
  dispatch(addMessage(message));
};
