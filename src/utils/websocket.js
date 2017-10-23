import parseJSON from './json-parser';

export const addOnOpenListener = (ws, handler) => {
  ws.addEventListener('open', handler);
};

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
    // NOTE: probably redundant, websocket will be recreated on close event
    if (!ws || ws.readyState === WebSocket.CLOSED ||
        ws.readyState === WebSocket.CLOSING) {
      // handler();
    }
  });
};

export const addOnMessageListener = (websocket, handler) => {
  /* eslint callback-return: 0 */
  websocket.addEventListener('message', handler);
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
  const incoming = parseJSON(messageEvent.data);

  if (!incoming) {
    return;
  }
  incomingDataHandler(incoming)(specificHandler);
};

export const handleId = incoming => (addIdToState) => {
  const { id, type } = incoming;

  if (type === 'SET_ID') {
    addIdToState({
      id
    });
  }
};

export const handleMessage = incoming => (addMessageToState) => {
  const {
    id, name, text, type
  } = incoming;

  if (type === 'MESSAGE') {
    addMessageToState({
      message: {
        id,
        nickname: name,
        text
      }
    });
  }
};

export const handleTypingData = incoming => (addTypingDataToState) => {
  const { name, type } = incoming;

  if (type === 'IS_TYPING') {
    addTypingDataToState({
      whoIsTyping: [name]
    });
  }
};

export default function createWebSocket(handlers) {
  const {
    openHandler,
    closeHandler,
    errorHandler,
    addIdToState,
    addMessageToState,
    addTypingDataToState
  } = handlers;
  const ws = new WebSocket('ws://localhost:8787');

  addOnOpenListener(ws, openHandler);
  addOnCloseListener(ws, closeHandler);
  addOnErrorListener(ws, errorHandler);
  // addOnMessageListener(ws, parseMsg(handleId(addIdToState)));
  addOnMessageListener(ws, parseMsg(handleId, addIdToState));
  addOnMessageListener(ws, parseMsg(handleMessage, addMessageToState));
  addOnMessageListener(ws, parseMsg(handleTypingData, addTypingDataToState));

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
//     const {id, type, name, text} = incoming;
//
//     switch (type) {
//       case 'IS_TYPING':
//         if (typeof typingHandler === 'function') {
//           typingHandler({
//             whoIsTyping: [name]
//           });
//         }
//         break;
//       case 'MESSAGE':
//         if (typeof messageHandler === 'function') {
//           messageHandler({
//             message: {
//               id,
//               nickname: name,
//               text
//             }
//           });
//         }
//         break;
//       case 'SET_ID':
//         if (typeof idHandler === 'function') {
//           idHandler({
//             id
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
//     const {type, name} = incoming;
//
//     if (type === 'IS_TYPING') {
//       typingHandler({
//         whoIsTyping: [name]
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
//     const {id, type, name, text} = incoming;
//
//     if (type === 'MESSAGE') {
//       messageHandler({
//         message: {
//           id,
//           nickname: name,
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
//     const {id, type} = incoming;
//
//     if (type === 'SET_ID') {
//       idHandler({
//         id
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
//     const {id, type, name, text} = incoming;
//
//     const extracted = {
//       SET_ID: {
//         id
//       },
//       MESSAGE: {
//         message: {
//           id,
//           nickname: name,
//           text
//         }
//       },
//       IS_TYPING: {
//         whoIsTyping: [name]
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
