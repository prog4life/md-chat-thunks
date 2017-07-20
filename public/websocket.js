const clientData = {
  websocket: null,
  id: null,
  // TODO: replace by native getter, temporary used custom one
  get(prop) {
    return this[prop];
  },
  set(prop, value) {
    prop = typeof prop === 'string' ? prop : prop.toString();
    this[prop] = value;
  }
};

var websocketForm = document.querySelector('.websocket-wrapper > form');
var websocketInput = websocketForm['websocket-message'];
let chatArea = document.getElementById('chat-area');

setTimeout(setConnection, 1000, websocketInput.value);

// TODO: typing notification for WebSocket connection
// TODO: do not sendback own message to myself, only show

websocketForm.addEventListener('submit', function (event) {
  'use strict';
  event.preventDefault();
  var ws = clientData.get('websocket');
  var id = clientData.get('id');
  // display sending message
  let newLi = document.createElement('li');
  chatArea.appendChild(newLi).innerHTML = websocketInput.value;

  console.info('in-websocketForm event handler ws: %o', ws);

  if (ws && id) {
    sendData(ws, id, websocketInput.value);
  } else if (ws) {
    sendData(ws);
  } else {
    setConnection(websocketInput.value);
  }
  websocketInput.value = '';
});

function sendData(ws, id, inputText) {
  'use strict';
  console.log('in-sendData websocket: %o, id: %s, data: %o', ws, id, inputText);

  ws.send(JSON.stringify({
    id,
    inputText
  }));
}

// count attempts to get id from server
// let attempts = requestId.attempts;

// attempts = attempts ? attempts : 0;
// if (attempts < 2) {
//   requestId.attempts++;
// } else {
// // failed 2 times to get id from server, initialize new connection
//   console.error('Unable to get id or message from server');
//   let connAttempts = setConnection.attempts;

//   connAttempts = connAttempts ? connAttempts : 0;
//   if (connAttempts < 1) {
//     setConnection.attempts++;
//     setConnection(inputText);
//   }
// }

// TODO: rename to setWebsocket and return "success" true or false or
// clientData.get('websocket'); check if websocket exists at the beginning
function setConnection(inputText) {
  'use strict';
  var ws = clientData.get('websocket');
  var id = clientData.get('id');

  // var ws = new WebSocket('ws://localhost:8888');
  // Note the protocol version: "wss", not "ws"                          !!!
  // var ws = new WebSocket('wss://main-dev2get.c9users.io');
  ws = new WebSocket('ws://localhost:8008');
  // var message = '';
  console.info('in-start websocket inputText: %s', inputText);
  console.info('in-start ws: %o', ws);
  // TODO: check passed arg onopen
  ws.onopen = function () {
    console.log('websocket connection established');

    clientData.set('websocket', ws);

    console.info('in-start id: %s', id);

    console.log('open connection with ws: %o and id: %s', ws, inputText);
    // to get new id from server at new websocket connection
    sendData(ws);
  };

  ws.onmessage = (incoming) => {
    console.log('setConn onmessage incoming: ', incoming);
    let responseData = JSON.parse(incoming.data);
    let newId = responseData.id;
    let message = responseData.inputText; // toString()

    // get new client id from server object with empty message
    if (newId && !message) {
      clientData.set('id', newId);
      // let inputText = websocketInput.value;

      if (inputText) {
        // after getting new id send input text if present
        sendData(ws, newId, inputText);
      }
    // get another user's message with id from server
    } else if (newId) {
      console.log('Get message from server: ', message);
      // display received message
      chatArea.appendChild(document.createElement('li')).innerHTML = message;
    }
  };

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

  ws.onclose = function (event) {                          // TODO: reconnect
    if (event.wasClean) {
      console.log('websocket connection closed clean');
    } else {
      console.log('websocket connection lost');
    }
    console.log('websocket closing code: ' + event.code + ', reason: ' +
      event.reason);
  };

  ws.onerror = function (error) {                         // TODO: reconnect ?
    console.error('websocket error occurred: ' + error.message);
  };
}

// Need to test if this will work here:

//ws.on('open', function open() {
//    ws.send('something');
//});
//
//ws.on('message', function(data, flags) {
//    // flags.binary will be set if a binary data is received.
//    // flags.masked will be set if the data was masked.
//});
