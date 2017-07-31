export default function startWs(cb) {
  const ws = new WebSocket('ws://localhost:8787');

  cb(ws);

  ws.onopen = () => {
    // server must generate new id, and respond with it
    const dataToSend = {
      type: 'GET_ID'
    };

    ws.send(JSON.stringify(dataToSend));
  };
}

export const setOnMessageHandler = (ws, cb) => {
  ws.onmessage = (messageEvent) => {
    const incoming = parseJSON(messageEvent.data);

    if (!incoming) {
      return;
    }
    const {id, type, name, message: incomingMessage, participants} = incoming;

    switch (type) {
      case 'SET_ID':
        // if (message && message.length > 1) {
        //   ws.send(JSON.stringify({
        //     id,
        //     name: Array.from(message).reverse().join(''), // TODO: change to real name later
        //     message,
        //     type: 'MESSAGE'
        //   }));
        // }
        // clientData.id = id;
        cb(null, { id });
        break;

      case 'MESSAGE':
        cb(null, {
          message: {
            id,
            isNotification: false,
            nickname: name,
            message: incomingMessage
          }
          // participants
        });
        // showMessage(id, incomingMessage); // TODO: replace id by name
        break;

      case 'IS_TYPING':
        cb(null, {
          whoIsTyping: [name]
        });
        // showIsTyping(name);
        break;

      case 'JOIN_CHAT':
        // showInfo(type, name);
        break;
      case 'LEAVE_CHAT':
        // showInfo(type, name);
        break;
      case 'CHANGE_NAME':
        // showInfo(type, name);
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
//       isNotification: true, // or false
//       nickame: 'some user*s nickname',
//       message: 'some tex'
//     }
//   ],
//   whoIsTyping: ['username'],
//   participants: 43
// }

const parseJSON = (json) => {
  let parsed = null;

  try {
    parsed = JSON.parse(json);
  } catch (e) {
    console.error('Failed to parse incoming data ', e);
    return false;
  }
  return parsed;
};
