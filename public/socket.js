var socketForm = document.querySelector('.socket-wrapper > form');
var socketInput = socketForm['socket-message'];

setTimeout(startWebsocket, 1000, socketInput);

// TODO: typing notification for WebSocket connection
// TODO: do not sendback own message to myself, only show

socketForm.addEventListener('submit', function(event) {
    'use strict';
    event.preventDefault();
    console.info('in-add ws: %o', clientData.get('websocket'));
    var ws = clientData.get('websocket');
    var id = clientData.get('id');

    if (ws) {
        sendSocket(ws, id, socketInput.value);
        socketInput.value = '';
    } else {
        startWebsocket(socketInput);
    }
});

function sendSocket(socket, id, data) {
    'use strict';
    console.log('in-sendSocket socket: %o, id: %s, data: %o', socket, id, data);
    console.log('in-sendSocket arguments: %o', arguments);

    socket.send(JSON.stringify({
        // clientId: clientData.get('id'),
        clientId: id,
        content: data
    }));
    // socketInput.value = '';
}

// TODO: rename to setWebsocket and return "success" true or false or
// clientData.get('websocket'); check if socket exists at the beginning
function startWebsocket(input) {
    'use strict';
    // var message = '';
    console.info('in-start socket input: %s', input.value);
    console.info('in-start ws: %o', ws);
    console.info('in-start id: %s', clientData.get('id'));

    // var ws = new WebSocket('ws://localhost:8888');
    // Note the protocol version: "wss", not "ws"                          !!!
    var ws = new WebSocket('wss://main-dev2get.c9users.io');
    var id = clientData.get('id');

    ws.onopen = function() {
        console.log('Socket connection established');

        if (!id) {
            // ws.send();
            // sendSocket(ws);
            sendSocket.call(null, ws);
        } else {
            // sendSocket(ws, id, input.value);
            clientData.set('websocket', ws);
            sendSocket.call(null, ws, id);
            // input.value = '';
        }
    };

    ws.onmessage = function(event) {
        console.log('Socket message received: %s', event.data);

        var incoming = handleIncoming(event.data);

        if (incoming.type === 'setId' && id) {
            console.log('onmessage sendSocket, incoming type: %s', incoming.type);

            clientData.set('websocket', ws);
        }
        // maybe need to check somehow if long-polling.js is loaded
        // showMessage(message);  // replaced to handleIncoming()
    };

    ws.onclose = function(event) {                          // TODO: reconnect
        if (event.wasClean) {
            console.log('Socket connection closed clean');
        } else {
            console.log('Socket connection lost');
        }
        console.log('Socket closing code: ' + event.code + ', reason: ' +
            event.reason);
    };

    ws.onerror = function(error) {                         // TODO: reconnect ?
        console.error('Socket error occurred: ' + error.message);
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
