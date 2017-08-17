import parseJSON from '../helpers/json-parser';

// TODO: consider storing websocket object and id in here, and replacing
// them from App state
// TODO: set to newly created in startWebSocket
// let ws = null;

export default function startWebSocket(done) {
  const ws = new WebSocket('ws://localhost:8787');

  ws.onopen = (openEvent) => {
    done(ws);
  };
  // TODO: remove this, server is sending id on connection automatically at now
  // ws.onopen = () => {
  //   // server must generate new id, and respond with it
  //   const dataToSend = {
  //     type: 'GET_ID'
  //   };
  //
  //   ws.send(JSON.stringify(dataToSend));
  // };
}

export const setOnMessageHandler = (ws, cb) => {
  /* eslint callback-return: 0 */
  ws.onmessage = (messageEvent) => {
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
  };
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
