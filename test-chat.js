function Chat() {
    'use strict';

    var clients = { 35435354353: 'whatever' };

    this.clientIdArray = ['35435354353', 56555555];

    //this.createOperator = function () {
    //    return {
    //        getAllClients: function () {
    //            return clients;
    //        },
    //        addOneClient: function (clientData) {
    //            clients[Math.random().toString().slice(2)] = clientData;
    //        },
    //        removeOneClient: function (clientID) {
    //            delete clients[clientID];
    //        }
    //    };
    //};

    this.operator = (function (clientsCopy, idArrayCopy) {  // Looks like were not copied
        return {
            getAllClients: function () {
                return clientsCopy;
            },
            addOneClient: function (clientData) {
                var id = Math.random().toString().slice(2);
                clientsCopy[id] = clientData;
                idArrayCopy.push(id);
            },
            getIdArray: function () {
                console.log('in-operator idArrayCopy: %s', idArrayCopy);
                return idArrayCopy;
            }
        };
    }(clients, this.clientIdArray));

    this.getClientValue = function (id) {
        return clients[id];
    };

    this.addClient = function (id, value) {
        clients[id] = value;
    };
}

Chat.prototype.showAll = function () {
    'use strict';
    var client = this.getClientValue;
    var idList = this.clientIdArray;

    for (var i = 0; i < idList.length; i++) {
        console.log('client with id: %s has value: %s', idList[i], client(idList[i]));
    }
};

Chat.prototype.addOne = function(value) {
    'use strict';
    var idList = this.clientIdArray;
    var newID;

    process.nextTick(function createNewID() {
        for (var i = 0; i < 1000000; i++) {
            var createdID = Math.random().toString().slice(2);
        }

        for (var i = 0; i < idList.length; i++) {
            if (idList[i] === createdID) {
                createNewID();
                return;
            }
        }
        console.log('creator callback before return');

        newID = createdID;
    });

    console.log('after newID: ' + newID);
    idList.push(newID);

    this.addClient(newID, value);
};

function PrivateChat() {
    Chat.call(this);
}

PrivateChat.prototype = Object.create(Chat.prototype);

var chat = new Chat();
var privateChat = new PrivateChat();


chat.addOne('buddy');
chat.addOne('unexpected');
// chat.showAll();

//var chatOperator = chat.createOperator();

var chatOperator = chat.operator;
chatOperator.addOneClient('placeholder client data');
chatOperator.addOneClient('another client data');

var allClients = chatOperator.getAllClients();



// for (var clientID in allClients) {
//     if (allClients.hasOwnProperty(clientID)) {
//         console.log('chatOperator client with id: %s and value %s', clientID, allClients[clientID]);
//     }
// }

// console.log('chat.clientIdArray: %s', chat.clientIdArray);
// console.log('chatOperator.getAllClients(): %s', chatOperator.getAllClients());
// console.log('chatOperator.getIdArray(): %s', chatOperator.getIdArray());
// console.log('chat.showAll(): %s', chat.showAll()); // return undefined, so
// nothing to log

// privateChat.addOne('child comes here');
// client = 'deleted';
// console.log('privateChat.clients: ' + privateChat.clients);
// console.log('privateChat.clientIdArray : ' + privateChat.clientIdArray);
// console.log('privateChat.getClientValue("35435354353") : ' + privateChat.getClientValue('35435354353'));
// console.log('privateChat.addClient : ' + privateChat.addClient);
// console.log('privateChat.showAll : ' + privateChat.showAll);
// console.log('privateChat.addOne : ' + privateChat.addOne);
// console.log(chat.getClientValue('sample'));
