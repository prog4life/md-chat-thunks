function Chat() {
    'use strict';
    var clients = {};

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
// "clients" object with "subscribe" method, then delete "response(s)"
    this.publish = function(dataToSend) {
        for (var id in clients) {
            if (clients.hasOwnProperty(id)) {
                clients[id].json(dataToSend);
                delete clients[id]; // This is necessary, because can't respond
            }                       // more than 1 time per request
        }
    };

// add "response"(client) to chat's "clients" object
    this.subscribe = function(req, res) {
        // create new random id
        function createNewID() {
            var createdID = Math.random().toString().slice(2);

            for (var id in clients) {
                if (clients.hasOwnProperty(id) && clients[id] === createdID) {
                        createNewID();
                        return;  //   ???????????????????????????????????????????????????
                    }
                }
            return createdID;
        }
        var newID = createNewID();

        clients[newID] = res;
// delete "response" from "clients" on request/response "close" event,
// not shure whether one of next two is unnecessary
        req.on('close', function() {
            delete clients[newID];
        });

        res.on('close', function() {
            delete clients[newID];
        });
    };
}

//Chat.createChat = function() {
//    'use strict';
//    return new Chat();
//};

function createChat() {                                // Maybe try singleton ?
    'use strict';
    return new Chat();
}

// Alternative version, with in-prototype publish/subscribe methods
function Chat() {
    'use strict';
}


// Chat.prototype.publish = function(dataToSend) {
//     'use strict';
//     var clients = this.getClients();
//
//     for (var id in clients) {
//             console.log('1 in-publish id: ' + id + ' value: ' + clients[id]);
//         if (clients.hasOwnProperty(id)) {
//             console.log('2 in-publish id: ' + id + ' value: ' + clients[id]);
//
//             clients[id].json(dataToSend);
//             delete clients[id];
//         }
//     }
// };
//
// Chat.prototype.subscribe = function(req, res) {
//     'use strict';
//     var clients = this.getClients();
//
//     function createNewID() {
//         var createdID = Math.random().toString().slice(2);
//
//         for (var id in clients) {
//
//             //if (clients.hasOwnProperty(id) && clients[id] === createdID) {
//             if (clients.hasOwnProperty(id)) {
//
//                 console.log('in-subscribe id: ' + id + ' value: ' + clients[id]);
//
//                 if (clients[id] === createdID) {
//                     createNewID();
//                     return;  //   ???????????????????????????????????????????????????
//                 }
//
//             }
//         }
//         return createdID;
//     }
//     var newID = createNewID();
//
//     //this.addClient(newID, res);
//     clients[newID] = res;
//
//     console.log('in-subscribe new added id: ' + newID);
//
//     req.on('close', function () {
//         delete clients[newID];
//         console.log('request "close" event, deleted ' + newID);
//     });
//
//     res.on('close', function () {
//         delete clients[newID];
//         console.log('response "close" event, deleted ' + newID);
//     });
// };

//module.exports = Chat;
module.exports.Chat = Chat;
module.exports.createChat = createChat;
