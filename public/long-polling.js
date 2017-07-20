var longpollForm = document.querySelector('.longpoll-wrapper > form');
//var longpollingInput = document.getElementById('longpoll-message');
var longpollingInput = longpollForm['longpoll-message'];
//console.log('message value: ' + longpollingInput.value);

// TODO: do not sendback own message to myself, only show
// TODO: implement and rename to "isTyping"
var isTyping = false;

function ClientData() {
  var privates = {};
  // add var ??? or completely remove next declarations
  privates.id;
  privates.websocket;
  privates.name;
  this.set = function (property, value) { privates[property] = value; }
  this.get = function (property) { return privates[property]; }
}
var clientData = new ClientData();

// TODO: replace above construtor with obj initializer:
// var clientData = {
// TODO: conecterd: true, and connection checker
//     id: 0,
//     name: ''
//     get ...,
//     set ...
// };

longpollForm.onsubmit = function (event) {
  'use strict';
  event.preventDefault();
  sendLongPollingMessage(longpollingInput);
};

subscribe();

function sendLongPollingMessage(input) {
  'use strict';

  var xhr = new XMLHttpRequest();
  // xhr.open('POST', 'http://localhost:8888/comet/', true);
  xhr.open('POST', 'https://main-dev2get.c9users.io/comet/', true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  xhr.send(JSON.stringify({ message: input.value }));
  input.value = '';
}

function subscribe() {
  'use strict';

  // var url = clientData.get('id')
  //     ? 'http://localhost:8888/subscribe?id=' + clientData.get('id')
  //     : 'http://localhost:8888/subscribe';

  var url = clientData.get('id')
    ? 'https://main-dev2get.c9users.io/subscribe?id=' + clientData.get('id')
    : 'https://main-dev2get.c9users.io/subscribe';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onload = function () {
    if (this.status === 200) {
      handleIncoming(this.response);
      subscribe();

    } else {
      console.log('Some xhr error, status isn\'t 200');
    }
  };

  xhr.onerror = function (error) {
    console.error('Some error during xhr response: %o', error);
    setTimeout(subscribe, 10000);
  };
  xhr.send();
}
// TODO: rename to handleResponse
function handleIncoming(incoming) {
  // added for additional functionality(isTyping, setId, reconnect)
  try {
    incoming = JSON.parse(incoming);
  } catch (e) {
    console.error('Error during incoming JSON parsing: ' + e);
  }
  switch (incoming.type) {
    case 'isTyping':
      // moved here from "showIsTyping" function
      if (incoming.id === clientData.get('id')) {
        return;
      }
      showIsTyping(incoming.id);
      break;
    case 'setId':
      clientData.set('id', incoming.id || incoming.clientId);  // TODO check this
      break;
    case 'reconnect':                                    //   TODO
      break;
    default:
      console.log('incomin %o: ', incoming);
      showMessage(incoming.message || incoming.content);
  }
  return incoming;
}

function showMessage(message) {
  'use strict';
  var chatArea = document.getElementById('chat-area');
  // console.log('chatArea LOCAL initial value: ' + chatArea.innerHTML);
  var messageLi = chatArea.appendChild(document.createElement('li'));

  messageLi.innerHTML = message;
  // console.log('chatArea LOCAL filled value: ' + chatArea.innerHTML);
}

function showIsTyping(id, repeats = 1) {
  console.log('isTyping notification received');
  var isTypingElement = document.querySelector('div.typing');

  var counter = 0;
  var MAX_INTERVALS = (4 * repeats) - 1;    //  3 - 7 - 11 - 15 - ...;
  var phrase = isTypingElement.innerHTML = id + ' is typing';

  var typingInterval = setInterval(function () {
    isTyping = true;
    if (counter === MAX_INTERVALS) {
      console.log('output interval: ' + typingInterval);
      clearInterval(typingInterval);
      counter = 0;
      isTyping = false;
      isTypingElement.innerHTML = '';
      console.log('output is cleared, counter: ' + counter);
      return;
    } else if ((counter + 1) % 4 === 0) {   //  3 - 7 - 11 - 15 - ...;
      isTypingElement.innerHTML = phrase;
      counter++;
      console.log('output is set as initial phrase, counter: ' + counter);
    } else {
      isTypingElement.innerHTML += '.';
      counter++;
      console.log('add one dot, counter: ' + counter);
    }
  }, 400);

  // var typingInterval = setInterval(function() {
  //     isTyping = true;
  //     if (counter === MAX_INTERVALS) {
  //         clearInterval(typingInterval);
  //         counter = 0;
  //         isTyping = false;
  //         isTypingElement.innerHTML = '';
  //         return;
  //     }
  //     switch (counter) {
  //         сase 0:
  //         case REPEAT:
  //             isTypingElement.innerHTML = id + ' is typing';
  //             counter++;
  //             break;
  //         case 'Someone is typing...':
  //             isTypingElement.innerHTML = 'Someone is typing';
  //             counter++;
  //             break;
  //         default:
  //             isTypingElement.innerHTML += '.';
  //             counter++;
  //             break;
  //     }
  // });

  // isTypingElement.innerHTML = typing[counter];
  //
  // var typing = {};
  // var oneTyping = id + ' is typing'
  // typing['0'] = typing['3'] = oneTyping;
  // typing['1'] = oneTyping + '.';
  // typing['2'] = oneTyping + '..';
  // typing['3'] = oneTyping + '...';
  // typing['5'] = oneTyping + '.';
  // typing['6'] = oneTyping + '.';
  // }
}

// Alternative version, with objects and constructors

//function LongPolling(form) {
//    var input = form['longpoll-message'];
//
//    form.onsubmit = function(event) {
//        event.preventDefault();
//        sendRequest();
//    };
//
//    function sendRequest() {
//        var xhr = new XMLHttpRequest();
//        xhr.open('GET', 'http://localhost:8888/comet/' + message.value, true);
//        xhr.send();
//        message.value = '';
//    }
//}
//
////new LongPolling(longpollForm);
////new Subscriber(chatArea);
//
//function Subscriber(chatArea) {
//    function subscribe() {
//        var xhr = new XMLHttpRequest();
//        xhr.open('GET', 'http://localhost:8888/subscribe', true);
//        xhr.onload = function() {
//            if (this.status === 200) {
//                var message = JSON.parse(this.response).message;
//
//                showMessage(message);
//                subscribe();
//            } else {
//                console.log('Some xhr error, status !== 200');
//            }
//        };
//        xhr.onerror = function() {
//            setTimeout(subscribe, 3000);
//        };
//        xhr.send();
//    }
//    function showMessage(message) {
//        var messageLi = chatArea.appendChild(document.createElement('li'));
//        messageLi.innerHTML = message;
//    }
//    subscribe();
//}
