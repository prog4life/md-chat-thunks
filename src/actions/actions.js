import parseJSON from '../utils/json-parser';
// NOTE: alternatively store it in App component and pass to thunks
let webSocket;

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
        // TODO: replace by addMessage
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
  webSocket.addEventListener('error', (error) => {
    console.log(`webSocket Error: ${error.message}`);
    // TODO: close
    // if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
    //   this.websocket.close();
    // }
    dispatch({
      type: 'WEBSOCKET_ERROR',
      readyState: webSocket.readyState
    });
  });
};

export const addOnCloseListener = () => (dispatch) => {
  webSocket.addEventListener('close', (event) => {
    // TODO: reopen
    console.log(`Closing wasClean: ${event.wasClean}`);
    console.log(`Close code: ${event.code}, reason: ${event.reason}`);
    dispatch({
      type: 'WEBSOCKET_CLOSE',
      readyState: webSocket.readyState
    });
  });
};

export const addOnOpenListener = () => (dispatch) => {
  webSocket.onopen = () => {
    dispatch({
      type: 'WEBSOCKET_OPEN',
      readyState: webSocket.readyState
    });
    // NOTE: if wrap into Promise can resolve with readyState
  };
  return webSocket;
};
// TODO: convert to thunk or use as usual function/action creator
export const requestNewId = () => {
  webSocket.send(JSON.stringify({
    type: 'GET_ID'
  }));
  return {
    type: 'ID_REQUESTED'
  };
};

export const setupConnection = () => (dispatch, getState) => {
  // TODO: if already open, return existing ws
  webSocket = new WebSocket('ws://localhost:8787');

  // TODO: replace them to separate file and pass webSocket as param
  dispatch(addOnMessageListener());
  dispatch(addOnCloseListener());
  dispatch(addOnErrorListener());
  return dispatch(addOnOpenListener());
  // .then(() => {
  //   const { clientId } = getState();
  //   if (!clientId) {
  //     return dispatch(requestNewId());
  //   }
  //   return clientId;
  // });
};

export const checkIfReadyToChat = () => (dispatch, getState) => {
  const { readyState, clientId } = getState();

  if (readyState !== WebSocket.OPEN) {
    return false;
  }

  if (!clientId) {
    return false;
  }
  return true;
};

export const getReadyToChat = () => (dispatch, getState) => {
  const { readyState, clientId } = getState();

  if (readyState !== WebSocket.OPEN) {
    dispatch(setupConnection());
    return false;
  }

  if (!clientId) {
    dispatch(requestNewId());
    return false;
  }
  return true;
};

// TODO: refactor to sendAndShowMessage
export const sendAndShowMessage = (nickname, text) => (dispatch, getState) => {
  const { clientId } = getState();
  const message = {
    // TODO: add shortid (or timestamp in millisecs) here
    id: clientId || null,
    text,
    type: 'MESSAGE',
    status: 'UNSENT'
  };

  if (dispatch(checkIfReadyToChat())) {
    message.name = nickname;
    message.status = 'SENT';
    // TODO: extract separate action creator ?
    webSocket.send(message);
    dispatch({ type: 'MESSAGE_SENT' }); // NOTE: probably unnecessary
  } else {
    dispatch(addToUnsent(message)); // NOTE: must be before "getReadyToChat"
    dispatch(getReadyToChat());
  }
  // TODO: add "own" {Boolean} property
  message.nickname = nickname;
  dispatch(addMessage(message));
};
