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

// TODO: split into separate listener setters

export const addOnMessageListener = (websocket, callbacks) => {
  const {messageCallback, typingCallback, idCallback} = callbacks;
  /* eslint callback-return: 0 */
  websocket.addEventListener('message', (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {id, type, name, text} = incoming;

    switch (type) {
      case 'SET_ID':
        if (!idCallback) {
          return;
        }
        idCallback({ id });
        break;
      case 'MESSAGE':
        if (!messageCallback) {
          return;
        }
        messageCallback({
          message: {
            id,
            isNotification: false,
            nickname: name,
            text
          }
        });
        break;
      case 'IS_TYPING':
        if (!typingCallback) {
          return;
        }
        typingCallback({
          whoIsTyping: [name]
        });
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
