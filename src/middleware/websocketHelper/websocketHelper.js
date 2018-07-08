import mwWs, { ActionTypes } from 'redux-mw-ws';
import * as wsKeys from 'constants/websocket-keys';

const {
  RECEIVED_WEBSOCKET_DATA, WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED, WEBSOCKET_ERROR,
} = ActionTypes;

// import * as aT from 'constants/actionTypes'; // OR:
export const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN';
export const WEBSOCKET_CLOSED = 'WEBSOCKET_CLOSED';
export const CONNECTION_READY = 'CONNECTION_READY'; // if have at least clientId

export const websocketOpen = () => ({ type: WEBSOCKET_OPEN });
export const websocketClosed = () => ({ type: WEBSOCKET_CLOSED });

// shortener to send message using 'redux-mw-ws'
export const send = (outgoing, dispatch) => {
  dispatch({
    payload: outgoing,
    meta: { socket: true },
  });
};

export default function createWebsocketHelper(handlers) {
  if (typeof handlers !== 'object') {
    throw new Error('Required object with incoming message handlers by key');
  }
  if (Object.keys(handlers).every(key => key in wsKeys)) {
    throw new Error('Each property in handlers must be one of websocket keys');
  }
  const processIncoming = (incoming, dispatch) => {
    const { key } = incoming; // TODO: check key if it is string ?

    if (!handlers.hasOwnProperty(key)) {
      console.warn('No handler found for this incoming message key');
      return null;
    }
    return handlers[key](incoming, dispatch);
  };

  // MIDDLEWARE itself
  return ({ dispatch, getState }) => next => (action) => {
    if (!action.meta
        || !action.meta.socket
        || !Object.values(ActionTypes).includes(action.type)) {
      return next(action);
    }

    switch (action.type) {
      case WEBSOCKET_CONNECTED: {
        // NOTE: websocket server should send new client id after client action
        // without id, or right after connection, this way it will be
        // unnecessary to request id on open
        // const { id: clientId, nickname, token } = getState().client;
        //
        // // TODO: CONNECTION_READY if clientId and other auth data present?
        // // next(websocketOpen());
        // const outgoing = { key: wsKeys.INITIALIZATION, clientId, nickname, token };
        //
        // send(outgoing, dispatch);
        return next(action);
      }
      case WEBSOCKET_DISCONNECTED:
        return next(action);
      case RECEIVED_WEBSOCKET_DATA:
        return processIncoming(action.payload, dispatch) || next(action);
      // case WEBSOCKET_ERROR:
      //   return {
      //     ...state,
      //     errorMessage: action.payload.message,
      //     endpoint: action.meta.socket,
      //   };
      default:
        return next(action);
    }
  };
}

// const handleReceivedData = (next, incoming) => {
//   switch (incoming.key) {
//     case 'IS_TYPING':
//       next(receiveTyping(nickname));
//       break;
//     case 'MESSAGE':
//       next(receiveMessage({ ...incoming, isOwn: false }));
//       // to terminate showing typing notification if new message is received
//       // from one whose typing notification is showing
//       next(stopTypingNotification(nickname));
//       break;
//     case 'SET_ID':
//       next(setClientId(clientId));
//       // next(sendUnsentMessages());
//       break;
//     case 'SIGN_IN':
//       next(setClientId(clientId));
//       next(setToken(token));
//       break;
//     case 'SIGN_UP':
//       next(setClientId(clientId));
//       next(setToken(token));
//       break;
//     case 'Join_Wall':
//       console.log('Joined the wall');
//       // dispatch(joinWallSuccess(incoming));
//       break;
//     case 'PONG':
//       // handleServerPong();
//       break;
//     case 'ADD_CHAT':
//       // next(addChat(chatId, participants));
//       break;
//     case 'CHANGE_NAME':
//       break;
//     case 'JOIN_CHAT':
//       break;
//     case 'LEAVE_CHAT':
//       break;
//     default:
//       console.warn('Unknown websocket incoming message key');
//   }
// };
