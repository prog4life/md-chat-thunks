const clientData = {
  websocket: null,
  id: '',
  name: '',
  // TODO: consider using getters
  // get id() {
  //   return this.id;
  // },
  // get websocket() {
  //   return this.websocket;
  // },
  set(prop, value) {
    const propName = typeof prop === 'string' ? prop : prop.toString();

    this[propName] = value;
  }
};

// webSocket message data structure:
const sentData = {
  // "SET_ID"(from server), "MESSAGE", "LEAVE_CHAT", "CHANGE_NAME", "JOIN_CHAT"
  type: 'GET_ID', // "IS_TYPING"
  id: '2342525253', // assigned by uuid at server
  name: 'Nickname',
  message: 'Sent text',
  // number of connected clients (users) converted to string, sent from server
  participants: '55'
};

const websocketForm = document.querySelector('.websocket-wrapper > form');
const websocketInput = websocketForm['websocket-message'];
const chatArea = document.getElementById('chat-area');

// let message = websocketInput.value;

setTimeout(startWs, 1000, websocketInput.value);

// TODO: typing notification for WebSocket connection
// TODO: do not sendback own message to myself, only show

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

const showMessage = (id, message) => {
  const newLi = document.createElement('li');

  chatArea.appendChild(newLi).innerHTML = id + ': ' + message;
};

const handleWebSocketFormSubmit = (event) => {
  event.preventDefault();
  const message = websocketInput.value;

  if (message.length < 1) {
    websocketInput.focus();
    return;
  }

  const {websocket: ws, id, name} = clientData;

  // restore connection on CLOSED or CLOSING ws readyState, like in situation
  // when server was temporary down, and on OPENING, assuming it takes too long
  if (ws && id && ws.readyState === 1) {
    ws.send(JSON.stringify({
      id,
      name: Array.from(message).reverse().join(''), // TODO: change to real name later
      message,
      type: 'MESSAGE'
    }));
    // view sent message
    // TODO: replace id by name later
    showMessage(id, message);
  } else {
    startWs(message);
  }
  websocketInput.value = '';
};

websocketForm.addEventListener('submit', handleWebSocketFormSubmit);

const checkIncomingData = (incomingData) => {
  const parsedIncoming = parseJSON(incomingData);

  const {id, name, message, type} = parsedIncoming;
  let {participants} = parsedIncoming;

  if (typeof id !== 'string' || id.length < 1 || id.length > 20) {
    console.error('Got too long or empty or not string id from server');
    return false;
  }

  if (typeof type !== 'string' || type === '') {
    console.error('Got type that is empty string or not string');
    return false;
  }

  if (type !== 'SET_ID' && type !== 'IS_TYPING') {
    if (typeof name !== 'string' || name === '') {
      console.error('Got name that is empty string or not string');
      return false;
    }

    if (typeof message !== 'string' || message === '') {
      console.error('Got message that is empty string or not string');
      return false;
    }
    // TODO: consider sending participants as integer
    if (typeof participants !== 'string' || participants === '') {
      console.error('Got participants that is empty string or not string');
      participants = null;
    }
  }

  return {
    id,
    type,
    name,
    message,
    participants
  };
};

// TODO: check if websocket already exists; return "success" true or false or
// clientData.get('websocket'); check if websocket exists at the beginning
function startWs(message) {
  // Note the protocol version: "wss", not "ws"                          !!!
  // const ws = new WebSocket('wss://main-dev2get.c9users.io');
  const ws = new WebSocket('ws://localhost:8888');

  console.info('in-startWs message: %s', message);
  console.info('in-startWs ws: %o', ws);

  ws.addEventListener('open', (open) => {
    console.log('websocket connection established with openEvent ', open);
    console.log('open connection with ws: %o and message: %s', ws, message);

    // server must generate new id, and respond with it
    const dataToSend = {
      type: 'GET_ID'
    };

    ws.send(JSON.stringify(dataToSend));

    clientData.set('websocket', ws);
  });

  ws.addEventListener('message', (messageEvent) => {
    console.log('startWs onmessage incoming: ', messageEvent);

    const incoming = checkIncomingData(messageEvent.data);

    if (!incoming) {
      return;
    }

    const {id, type, name, message: incomingMessage, participants} = incoming;

    switch (incoming.type) {
      case 'SET_ID':
        clientData.id = id;

        if (message && message.length > 1) {
          ws.send(JSON.stringify({
            id,
            name: Array.from(message).reverse().join(''), // TODO: change to real name later
            message,
            type: 'MESSAGE'
          }));
        }
        break;

      case 'MESSAGE':
        showMessage(id, incomingMessage); // TODO: replace id by name
        break;

      case 'IS_TYPING':
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
  });

  // will be called when the WebSocket connection's "readyState" changes to
  // CLOSED. The listener receives a "CloseEvent" named "close"
  // TODO: if was not clean - reconnect, wipe id
  ws.addEventListener('close', (close) => {
    if (close.wasClean) {
      console.log('websocket connection closed clean');
    } else {
      console.log('websocket connection lost, restoring...');
      // startWs();
      // let retryConnectId = setInterval(() => {
      //   if (clientData.ws.readyState === 1) {
      //     retryConnectId = null;
      //     return;
      //   }
      //   startWs();
      // }, 1000);
    }
    console.log('websocket closing code: ' + close.code + ', reason: ' +
      close.reason);
  });

  // TODO: reconnect, wipe id
  ws.addEventListener('error', (error) => {
    console.error('websocket error occurred: ' + error.message);
  });
}

// ----------------------------------------------------------------------------

// count attempts to get id from server
// let attempts = requestId.attempts;

// attempts = attempts ? attempts : 0;
// if (attempts < 2) {
//   requestId.attempts++;
// } else {
// // failed 2 times to get id from server, initialize new connection
//   console.error('Unable to get id or message from server');
//   let connAttempts = startWs.attempts;

//   connAttempts = connAttempts ? connAttempts : 0;
//   if (connAttempts < 1) {
//     startWs.attempts++;
//     startWs(inputText);
//   }
// }
// ----------------------------------------------------------------------------
// OLD onmessage
// ws.onmessage = function (event) {
//   console.log('websocket incoming data received: %s', event.data);

//   if (id) {
//     console.log('Get data from serv ', event.data);
//   } else {
//     clientData.set('id', event.data.id);
//   }

  // var incoming = handleIncoming(event.data);

  // if (incoming.type === 'setId' && id) {
  //   console.log('onmessage sendData, incoming type: %s', incoming.type);

  //   clientData.set('websocket', ws);
  // }
  // maybe need to check somehow if long-polling.js is loaded
  // showMessage(message);  // replaced to handleIncoming()
// };
// ----------------------------------------------------------------------------
// Need to test if this will work here:

// ws.on('open', function open() {
//    ws.send('something');
// });
//
// ws.on('message', function(data, flags) {
//    // flags.binary will be set if a binary data is received.
//    // flags.masked will be set if the data was masked.
// });
