import parseJSON from '../helpers/json-parser';

export default function openWebSocket(done) {
  const ws = new WebSocket('ws://localhost:8787');

  ws.onopen = (openEvent) => {
    // NOTE: it could be better to add here first on message listener, that
    // will parse incoming JSON and store it in module scope variable
    done(ws);
  };
  ws.onerror = (error) => {
    console.warn('closing websocket due to error: ', error);
    ws.close();
  };
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
        if (typingHandler) {
          typingHandler({
            whoIsTyping: [name]
          });
        }
        break;
      case 'MESSAGE':
        if (messageHandler) {
          messageHandler({
            message: {
              id,
              isNotification: false,
              nickname: name,
              text
            }
          });
        }
        break;
      case 'SET_ID':
        if (idHandler) {
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
          isNotification: false,
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
//           isNotification: false,
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
