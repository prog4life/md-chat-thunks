longpollingInput.addEventListener('input', handleTypingEvent);
var listenerPresent = true;

function handleTypingEvent() {
    'use strict';
    if (isTyping) {
        return;
    }
    console.log('1st attached listenerPresent: ' + listenerPresent);

    sendTypingNotification();

    longpollingInput.removeEventListener('input', handleTypingEvent);

    listenerPresent = !listenerPresent;
    console.log('2nd dettached lstenerPresent: ' + listenerPresent);

    var listenerTimeoutId = setTimeout(function() {
        longpollingInput.addEventListener('input', handleTypingEvent);

        listenerPresent = !listenerPresent;
        console.log('3rd attached listenerPresent: ' + listenerPresent +
            ' listenerTimeutId: ' + listenerTimeoutId);
    }, 4000);
}

function sendTypingNotification() {
    'use strict';
    console.log('"sendTypingNotification" invoked, clientData.get("id"):' +
        clientData.get('id'));

    if (!clientData.get('id')) {
        return; // or subscribe();
    }

    var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'http://localhost:8888/comet/', true);
    xhr.open('POST', 'https://main-dev2get.c9users.io/comet/', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify({ type: 'isTyping', id: clientData.get('id') }));
}
