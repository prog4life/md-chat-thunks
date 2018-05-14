import { ActionTypes } from 'redux-mw-ws';
import * as aT from 'constants/actionTypes';

import {
  addChat, receiveTyping, receiveMessage, handleServerPong, sendUnsentMessages,
  requestClientId, setClientId, setToken, stopTypingNotification,
  websocketOpen, websocketClosed, joinWallSuccess,
} from 'actions';

const {
  WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED, RECEIVED_WEBSOCKET_DATA,
  // WEBSOCKET_ERROR,
} = ActionTypes;

const writeToWebsocket = (outgoing, dispatch) => {
  dispatch({
    payload: outgoing,
    meta: { socket: true },
  });
};

const createIncomingHandler = typesToHandlersMap => (
  // it will be "handleIncoming"
  (incoming, next) => {
    const { type } = incoming; // TODO: check type if it is string

    if (!typesToHandlersMap.hasOwnProperty(type)) {
      console.warn('Unknown websocket incoming message type');
      return null;
    }
    return typesToHandlersMap[type](incoming, next);
  }
);

const handleIncoming = createIncomingHandler({
  // SET_ID: ({ clientId }, next) => next(setClientId(clientId)),
  SIGN_IN: ({ clientId, token }, next) => {
    // next(setClientId(clientId));
    next(setToken(token));
  },
  SIGN_UP: ({ clientId, token }, next) => {
    // next(setClientId(clientId));
    next(setToken(token));
  },
  Join_Wall: (incoming, next) => {
    console.log('Joined the wall');
    // next(joinWallSuccess(incoming));
  },
});

export default function createWebsocketHandler(actions) {
  // MIDDLEWARE itself
  return ({ dispatch, getState }) => next => (action) => {
    if (!action.meta || !action.meta.socket ||
        !ActionTypes.hasOwnProperty(action.type)) {
      return next(action);
    }

    switch (action.type) {
      case WEBSOCKET_CONNECTED: {
        // NOTE: websocket server should send new client id after client action
        // without id, or right after connection, this way it will be
        // unnecessary to request id on open
        // if (getState().clientId) {
        //   return next(websocketOpen());
        // }
        return next(websocketOpen());
        // const outgoing = { type: 'GET_ID' };

        // writeToWebsocket(outgoing, dispatch);
        // return next(requestClientId());
        // return next({ type: aT.REQUEST_CLIENT_ID });
      }
      case WEBSOCKET_DISCONNECTED:
        return next(websocketClosed());
      case RECEIVED_WEBSOCKET_DATA:
        return handleIncoming(action.payload, next) || next(action);
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
//   switch (incoming.type) {
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
//       console.warn('Unknown websocket incoming message type');
//   }
// };
