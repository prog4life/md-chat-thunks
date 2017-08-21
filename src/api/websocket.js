import parseJSON from '../helpers/json-parser';

// TODO: consider storing websocket object and id in here, and replacing
// them from App state
// TODO: set to newly created in openWebSocket
// let ws = null;

export default function openWebSocket(done) {
  const ws = new WebSocket('ws://localhost:8787');

  ws.onopen = (openEvent) => {
    done(ws);
  };
  ws.onerror = (error) => {
    console.warn('closing websocket due to error: ', error);
    ws.close();
  };
}

// TODO: split into separate listener setters
export const addOnMessageListener = (ws, cb) => {
  /* eslint callback-return: 0 */
  // TODO: maybe it's reasonable to use addEventListener
  ws.addEventListener('message', (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {id, type, name, text} = incoming;

    switch (type) {
      case 'SET_ID':
        cb({ id });
        break;
      case 'MESSAGE':
        cb({
          message: {
            id,
            isNotification: false,
            nickname: name,
            text
          }
        });
        break;
      case 'IS_TYPING':
        cb({
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
        console.error('Unknown websocket message type, default case has fired');
    }
  });
};

// this.state = {
//   id: 'wa3rg4yxsf8se7fr943',
//   websocket: websocket
//   nickame: '',
//   messages: [
//     {
//       id: 'wa3rg4yxsf8se7fr943',
//       isNotification: true,
//       nickame: 'some user*s nickname',
//       text: 'some tex'
//     }
//   ],
//   whoIsTyping: ['username'],
// }
