import parseJSON from '../utils/json-parser';
// NOTE: alternatively store it in App component and pass to thunks
let webSocket;

export const addOnMessageListener = () => (dispatch) => {
  webSocket.addEventListener('message', (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {
      id, type, name: nickname, text
    } = incoming;

    switch (type) {
      case 'IS_TYPING':
        dispatch({ type: 'TYPING_OCCURS', nickname });
        break;
      case 'MESSAGE':
        dispatch({
          type: 'MESSAGE_RECEIVED',
          message: {
            id,
            nickname,
            text
          }
        });
        break;
      case 'SET_ID':
        dispatch({ type: 'ID_RECEIVED', id });
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

export const addOnErrorListener = () => (dispatch) => {
  webSocket.addEventListener('error', (event) => {
    if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
      this.websocket.close();
    }
    dispatch({
      type: 'CONNECTION_ERROR',
      error
    });
  });
}

export const addOnCloseListener = () => (dispatch) => {
  webSocket.addEventListener('close', (event) => {
    console.log(`Closing wasClean: ${event.wasClean}`);
    console.log(`Close code: ${event.code}, reason: ${event.reason}`);
    dispatch({
      type: 'CONNECTION_CLOSE',
      code: event.code,
      clean: event.wasClean
    });
  });
}

export const openWebSocket = () => (dispatch) => {
  const ws = new WebSocket('ws://localhost:8787');

  ws.onopen = () => {
    webSocket = ws;
    dispatch({ type: 'CONNECTION_OPEN' });
  };
  return ws;
};

export const requestNewId = () => {
  webSocket.send(JSON.stringify({
    type: 'GET_ID'
  }));
};

export const setupConnection = () => (dispatch, getState) => {
  dispatch(openWebSocket());
  if (getState().id) {
    dispatch(requestNewId);
  }
  dispatch(addOnMessageListener());
  dispatch(addOnCloseListener());
  dispatch(addOnErrorListener());
};
