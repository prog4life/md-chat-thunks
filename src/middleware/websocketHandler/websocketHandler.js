import { ActionTypes } from 'redux-mw-ws';

const {
  RECEIVED_WEBSOCKET_DATA,
  // WEBSOCKET_CONNECTED, WEBSOCKET_DISCONNECTED, WEBSOCKET_ERROR,
} = ActionTypes;

// export const writeToWebsocket = (outgoing, dispatch) => {
//   dispatch({
//     payload: outgoing,
//     meta: { socket: true },
//   });
// };

export default function createWebsocketHandler(handleIncoming) {
  // MIDDLEWARE itself
  return ({ dispatch, getState }) => next => (action) => {
    if (!action.meta || !action.meta.socket ||
        !ActionTypes.hasOwnProperty(action.type)) {
      return next(action);
    }

    switch (action.type) {
      // case WEBSOCKET_CONNECTED: {
      //   NOTE: websocket server should send new client id after client action
      //   without id, or right after connection, this way it will be
      //   unnecessary to request id on open
      //   if (getState().clientId) {
      //     return next(websocketOpen());
      //   }
      //   return next(websocketOpen());
      //   const outgoing = { key: 'GET_ID' };
      //
      //   writeToWebsocket(outgoing, dispatch);
      //   return next(requestClientId());
      //   return next({ type: aT.REQUEST_CLIENT_ID });
      // }
      // case WEBSOCKET_DISCONNECTED:
      //   return next(websocketClosed());
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
