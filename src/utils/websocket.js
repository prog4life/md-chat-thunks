import parseJSON from './json-parser';

export default function createWebSocket(openHandler) {
  const ws = new WebSocket('ws://localhost:8787');

  ws.onopen = (openEvent) => {
    openHandler(ws);
  };
  return ws;
}

export const addOnMessageListener = (websocket, handlers) => {
  const {idHandler, messageHandler, typingHandler} = handlers;

  /* eslint callback-return: 0 */
  websocket.addEventListener('message', (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {id, type, name, text} = incoming;

    switch (type) {
      case 'IS_TYPING':
        if (typeof typingHandler === 'function') {
          typingHandler({
            whoIsTyping: [name]
          });
        }
        break;
      case 'MESSAGE':
        if (typeof messageHandler === 'function') {
          messageHandler({
            message: {
              id,
              nickname: name,
              text
            }
          });
        }
        break;
      case 'SET_ID':
        if (typeof idHandler === 'function') {
          idHandler({
            id
          });
        }
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

export const addOnCloseListener = (websocket, closeHandler) => {
  websocket.addEventListener('close', (event) => {
    console.log(`Closing wasClean: ${event.wasClean}`);
    console.log(`Closed clean, code: ${event.code}, reason: ${event.reason}`);
    closeHandler();
  });
};

export const addOnErrorListener = (websocket, errorEventHandler) => {
  websocket.addEventListener('error', errorEventHandler);
};

// NOTE: alternatively can use following separate listener setters;
// also can pass done as one of params

export const addTypingListener = (websocket, typingHandler) => {
  websocket.addEventListener('message', (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {type, name} = incoming;

    if (type === 'MESSAGE') {
      typingHandler({
        whoIsTyping: [name]
      });
    }
  });
};

export const addMessageListener = (websocket, messageHandler) => {
  websocket.addEventListener('message', (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {id, type, name, text} = incoming;

    if (type === 'MESSAGE') {
      messageHandler({
        message: {
          id,
          nickname: name,
          text
        }
      });
    }
  });
};

export const addIdListener = (websocket, idHandler) => {
  websocket.addEventListener('message', (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {id, type} = incoming;

    if (type === 'MESSAGE') {
      idHandler({
        id
      });
    }
  });
};

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
