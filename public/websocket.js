const clientData = {
  websocket: null,
  id: null,
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

const websocketForm = document.querySelector('.websocket-wrapper > form');
const websocketInput = websocketForm['websocket-message'];
const chatArea = document.getElementById('chat-area');

// let message = websocketInput.value;

setTimeout(startWs, 1000, websocketInput.value);

// TODO: typing notification for WebSocket connection
// TODO: do not sendback own message to myself, only show

const sendMessage = (ws, id, message) => {
  console.info('in-sendMessage event handler ws: %o', ws);

  const dataToSend = JSON.stringify({
    id,
    message
  });

  ws.send(dataToSend);
};

// TODO: implement showing id
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

  const ws = clientData.websocket;
  const id = clientData.id;

  // TODO: check for CLOSED or CLOSING websocket state and reconnect if so
  // like in situation with server reboot

  if (ws && id) {
    sendMessage(ws, id, message);
    // view sent message
    showMessage(id, message);
  } else {
    // TODO: show notification about connection setup to user
    startWs(message);
  }
  websocketInput.value = '';
};

websocketForm.addEventListener('submit', handleWebSocketFormSubmit);

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

    // server must generate new id, process message (if present) with this id,
    // and respond with new id
    // TODO: consider replacing witn sendMessage(ws, null, message);
    const dataToSend = {};

    if (message.length > 1) {
      dataToSend.message = message;
    }
    ws.send(JSON.stringify(dataToSend));

    clientData.set('websocket', ws);
  });

  ws.addEventListener('message', (incoming) => {
    console.log('startWs onmessage incoming: ', incoming);

    const responseData = JSON.parse(incoming.data);
    // TODO: check incomingId length and type
    const incomingId = responseData.id;
    // TODO: need to use toString() ???
    const incomingMessage = responseData.message;

    if (!incomingId && !clientData.id) {
      // request new id again
      // TODO: consider replacing witn sendMessage(ws, null, null);
      ws.send(JSON.stringify({}));
      return;

    } else if (!incomingId) {
      console.error('Received message without sender id');
      return;
    }

    if (incomingMessage) {
      showMessage(incomingId, incomingMessage);
      return;
    }

    clientData.id = incomingId;

    if (message) {
      // after getting new id from server, shows it with own message,
      // passed to "startWs", not incoming message
      showMessage(incomingId, message);
    }
  });

  // will be called when the WebSocket connection's "readyState" changes to
  // CLOSED. The listener receives a "CloseEvent" named "close"
  // TODO: if was not clean - reconnect, wipe id
  ws.addEventListener('close', (close) => {
    if (close.wasClean) {
      console.log('websocket connection closed clean');
    } else {
      console.log('websocket connection lost');
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
