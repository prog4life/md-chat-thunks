function Chat() {
    'use strict';
    var clients = [];
    var sockets = {}; // or make array of objects with websocket, id properties

// TODO: split to separate Chat and Socket classes

    // use closures somehow, maybe return closure with private clients;
    // can return object with closures
    // return values of each item

    // 1: make all props public in-prototype(or create clients in subscribe)
    // inherit LongpollChat and SocketChat from
    // 2: make clients private with in-object methods and singleton chat

    //    Chat.prototype = {
    //      var clients = {}    ???
    //    }

// send data with "response.json()" to each "response", that have been added to
// "clients" array with "subscribe" method, then delete "response(s)"
    this.publish = function(responseBody) {
        console.log('in-publish initial clients length: ' + clients.length);
        clients.forEach(function(client, index, self) {
            // next check was replaced to client-side:
            // if (client.id === responseBody.id &&
            //     responseBody.type === 'isTyping') {
            //     return;
            // }
            client.res.json(responseBody);
            console.log('in-publish sent to client.id: %s', client.id);
            console.log('in-publish sent index: %s', index);
        });
        // clients.splice();
        clients.length = 0;
        console.log('in-publish final clients length: ' + clients.length);
    };

/**
*  TODO: fake responses to avoid browser "no response to subscribe" errors
*/

// add "response"(client) to chat's "clients" array
    this.subscribe = function(req, res, id) {

// TODO: use "arguments" somehow
// TODO: id is stored as string with this variant

        var client = {
            id: id,
            res: res
        };

        clients.push(client);

        for (var i = 0; i < clients.length; i++) {
            console.log('in-subscribe ' + i + ' client id: ' + clients[i].id);
            console.log('in-subscribe ' + i + ' client id type: ' + 
                typeof clients[i].id);
        }

// delete "response" from "clients" on request/response "close" event:
// which one of next two is unnecessary                                  ???
        req.on('close', function() {
            clients.forEach(function(element, index, self) {
                if (element === client) {         // maybe check id's
                    self.splice(index, 1);
                }
            });
            // clients.splice(clients.indexOf(client), 1);
            console.log('in-subscribe req close, clients.length: ' +
                '%s, client.id: %s, clients: %s', clients.length, client.id,
                clients);
        });

        res.on('close', function() {
            clients.forEach(function(element, index, self) {
                if (element === client) {
                    self.splice(index, 1);
                }
            });
            // clients.splice(clients.indexOf(client), 1);
            console.log('in-subscribe res close, clients.length: ' +
                '%s, client.id: %s, clients: %s', clients.length, client.id,
                clients);
        });

        return client;
    };

/**
* TODO: next method here and coresponding changes in server.js
*/

    this.sendSocket = function(message, socket) {
        console.log('in-sendSocket memory usage: %o', process.memoryUsage());
        console.log('socket is sending: %s', message);
        
    // wss.clients.forEach(function each(client) {
//   if (client !== ws && client.readyState === WebSocket.OPEN) {
//     client.send(data);
//   }
// });

        for (var id in sockets) {
            if (sockets.hasOwnProperty(id)) {      // probably an overkill here
                sockets[id].send(message, function(error) {
                    // The only way to check, that data send has been completed
                    console.error('sending with socket error: ' + error);
                });
            }
        }
    };

    this.addSocket = function(socket, message) {
        var needToSend = false;
        var id = message.clientId;
        // initial message from client; add socket , no response
        if (!message.content) {
            sockets[id] = socket;
            return needToSend;
        }
        if (!sockets[id]) {
            sockets[id] = socket;
        }
        needToSend = true;  // or return !needToSend;
        return needToSend;
    };

    this.assignId = function(res) {
        var id = createNewID();
        res.json({ type: 'setId', id: id });
        return id;
    };

// message from client without id => respond with new id
    this.assignSocketId = function(socket) {
        var id = createNewID();

        //  TODO throw new Error('in assignSocketId test error');

        var setIdMessage = JSON.stringify({ type: 'setId', id: id });
        socket.send(setIdMessage);
        return id;
    };

// create new random id
    function createNewID() {
        var createdID = Math.random().toString().slice(2, 10);

        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id === createdID) {
                createNewID();
                return;
            }
        }

        var idArray = Object.keys(sockets);
        for (var i = 0; i < idArray.length; i++) {
            if (idArray[i] === createdID) {
                createNewID();
                return;
            }
        }
        return createdID;
    }
}

//Chat.createChat = function() {
//    'use strict';
//    return new Chat();
//};

// Alternative version, with in-prototype methods:

// function Chat() {
//     'use strict';

//     var clients = [];
//     var sockets = {}; // or make array of objects with websocket, id properties

// TODO: split to separate Chat and Socket classes
// }

// Chat.prototype.publish = function(dataToSend) {
//     'use strict';
//     var clients = this.getClients();
//
// };

// Chat.prototype.subscribe = function(req, res) {
//     'use strict';
//     var clients = this.getClients();
//
//     this.addClient(newID, res);
//     clients[newID] = res;
// };

//module.exports = Chat;
module.exports.Chat = Chat;
module.exports.createChat = function() {               // Maybe try singleton ?
    'use strict';
    return new Chat();
};
