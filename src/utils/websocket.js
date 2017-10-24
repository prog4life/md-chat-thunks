import parseJSON from './json-parser';

// TODO: replace later by handler
export const addOnCloseListener = (ws, handler) => {
  ws.addEventListener('close', (event) => {
    console.log(`Closing code: ${event.code}, wasClean: ${event.wasClean}`);
    handler();
  });
};

export const addOnErrorListener = (ws, handler) => {
  ws.addEventListener('error', (event) => {
    console.log('Error event: ', event);
    if (ws && ws.readyState !== WebSocket.CLOSED) {
      ws.close();
    }
    // NOTE: probably redunclientIdnt, websocket will be recreated on close event
    if (!ws || ws.readyState === WebSocket.CLOSED ||
        ws.readyState === WebSocket.CLOSING) {
      // handler();
    }
  });
};

// export const parseMsg = (incomingDataHandler) => (messageEvent) => {
//   const incoming = parseJSON(messageEvent.data);
//
//   if (!incoming) {
//     return;
//   }
//   incomingDataHandler(incoming);
// };

export const parseMsg = (incomingDataHandler, specificHandler) => (messageEvent) => {
  // TODO: change to in-place JSON.parse()
  const incoming = parseJSON(messageEvent.data);

  if (!incoming) {
    return;
  }
  incomingDataHandler(incoming)(specificHandler);
};

export const handleId = incoming => (saveClientId) => {
  const { clientId, type } = incoming;

  if (type === 'SET_ID') {
    saveClientId({
      clientId
    });
  }
};

export const handleMessage = incoming => (addMessageToState) => {
  const { clientId, nickname, text, type } = incoming;

  if (type === 'MESSAGE') {
    addMessageToState({
      message: {
        clientId,
        nickname,
        text
      }
    });
  }
};

export const handleTypingData = incoming => (addTypingDataToState) => {
  const { nickname, type } = incoming;

  if (type === 'IS_TYPING') {
    addTypingDataToState({
      whoIsTyping: [nickname]
    });
  }
};

export default function createWebSocket(handlers) {
  const {
    // TODO: make them module level variables to use in removeEventListener
    openHandler,
    closeHandler,
    // errorHandler,
    saveClientId,
    addMessageToState,
    addTypingDataToState
  } = handlers;
  const ws = new WebSocket('ws://localhost:8787');

  ws.addEventListener('open', openHandler);
  addOnCloseListener(ws, closeHandler);
  // addOnErrorListener(ws, errorHandler);
  // ws.addEventListener('message', parseMsg(handleId(saveClientId)));
  ws.addEventListener('message', parseMsg(handleId, saveClientId));
  ws.addEventListener('message', parseMsg(handleMessage, addMessageToState));
  ws.addEventListener(
    'message',
    parseMsg(handleTypingData, addTypingDataToState)
  );

  return ws;
}

// ----------------------------------------------------------------------------

// export const addOnMessageListener = (websocket, handlers) => {
//   const {idHandler, messageHandler, typingHandler} = handlers;
//
//   /* eslint callback-return: 0 */
//   websocket.addEventListener('message', (messageEvent) => {
//     const incoming = parseJSON(messageEvent.data);
//
//     if (!incoming) {
//       return;
//     }
//     const {clientId, type, nickname, text} = incoming;
//
//     switch (type) {
//       case 'IS_TYPING':
//         if (typeof typingHandler === 'function') {
//           typingHandler({
//             whoIsTyping: [nickname]
//           });
//         }
//         break;
//       case 'MESSAGE':
//         if (typeof messageHandler === 'function') {
//           messageHandler({
//             message: {
//               clientId,
//               nickname,
//               text
//             }
//           });
//         }
//         break;
//       case 'SET_ID':
//         if (typeof idHandler === 'function') {
//           idHandler({
//             clientId
//           });
//         }
//         break;
//       case 'JOIN_CHAT':
//         break;
//       case 'LEAVE_CHAT':
//         break;
//       case 'CHANGE_NAME':
//         break;
//       default:
//         console.warn('Unknown websocket message type, default case has fired');
//     }
//   });
// };

// export const addOnCloseListener = (websocket, closeHandler) => {
//   websocket.addEventListener('close', (event) => {
//     console.log(`Closing wasClean: ${event.wasClean}`);
//     console.log(`Closed clean, code: ${event.code}, reason: ${event.reason}`);
//     closeHandler();
//   });
// };
//
// export const addOnErrorListener = (websocket, errorEventHandler) => {
//   websocket.addEventListener('error', errorEventHandler);
// };

// NOTE: alternatively can use following separate listener setters;
// also can pass done as one of params

// export const addTypingListener = (websocket, typingHandler) => {
//   websocket.addEventListener('message', (messageEvent) => {
//     const incoming = parseJSON(messageEvent.data);
//
//     if (!incoming) {
//       return;
//     }
//     const {type, nickname} = incoming;
//
//     if (type === 'IS_TYPING') {
//       typingHandler({
//         whoIsTyping: [nickname]
//       });
//     }
//   });
// };
//
// export const addMessageListener = (websocket, messageHandler) => {
//   websocket.addEventListener('message', (messageEvent) => {
//     const incoming = parseJSON(messageEvent.data);
//
//     if (!incoming) {
//       return;
//     }
//     const {clientId, type, nickname, text} = incoming;
//
//     if (type === 'MESSAGE') {
//       messageHandler({
//         message: {
//           clientId,
//           nickname,
//           text
//         }
//       });
//     }
//   });
// };
//
// export const addIdListener = (websocket, idHandler) => {
//   websocket.addEventListener('message', (messageEvent) => {
//     const incoming = parseJSON(messageEvent.data);
//
//     if (!incoming) {
//       return;
//     }
//     const {clientId, type} = incoming;
//
//     if (type === 'SET_ID') {
//       idHandler({
//         clientId
//       });
//     }
//   });
// };

// export const addOnMessageListener = (websocket, handlers) => {
//   websocket.addEventListener('message', (messageEvent) => {
//     const incoming = parseJSON(messageEvent.data);
//
//     if (!incoming) {
//       return;
//     }
//     const {clientId, type, nickname, text} = incoming;
//
//     const extracted = {
//       SET_ID: {
//         clientId
//       },
//       MESSAGE: {
//         message: {
//           clientId,
//           nickname,
//           text
//         }
//       },
//       IS_TYPING: {
//         whoIsTyping: [nickname]
//       }
//     };
//
//     Object.keys(handlers).forEach((handler) => {
//       if (type === handler) {
//         handlers[type](extracted[type]);
//       }
//     });
//   });
// };
