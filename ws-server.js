const websocket = require('ws');
const idis = require('short-id');

// TODO: apply uuid to set unique ids

const startWebsocket = (server) => {
  const wss = new websocket.Server({
    // TODO: try to use on diferent port while express server up and running
    // port: 8484, // OR:
    server, // set this or port above
    // clientTracking: true,
    verifyClient: (info, done) => {
      // info.req is client request object
      // console.log('info obj from verifyClient: ', info);
      // "express-session" was used in example
      // sessionParser(info.req, {}, () => { // parsing session from client
      // We can reject the connection by returning false to done(). For example,
      // reject here if user is unknown.
      done(true); // done(info.req.session.userId);
    },
    perMessageDeflate: false // compression extension disabled (default)
  });

  wss.on('connection', function connection(ws, req) {
    // Can use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    // It seems it's available only in a newer version
    // const location = url.parse(req.url, true);

    // wss.clients is a {Set} that stores all conected clients(added only
    // if clientTracking is true (default?))

    // TODO: check broadcasting

    ws.on('message', function incoming(message) {
      console.log('Socket message received: %s', message);

      // TODO: Sanity check the incoming data maybe within chat methods   !!!
      // Where to check data, in controller or in model
    //   var parsed = null;

    //   console.log('parsed: ' + parsed);

    //   try {
    //     parsed = JSON.parse(message);
    //   } catch (e) {
    //     console.log('in ws.on-message parsing JSON "message" error: ' + e);
    //   }

    //   // TODO add socket to store right after assigning id, without additional request - looks like done
    //   if (!parsed.clientId) {
    //     parsed.clientId = chat.assignSocketId(ws);
    //   }
    //   if (chat.addSocket(ws, parsed)) {
    //     chat.sendSocket(message);
    //   }
      let incomingData = null;

      try {
        incomingData = JSON.parse(message);
      } catch (e) {
        console.error(e);
      }
      console.log('parsed incomingData: ', incomingData);

      const {id, name, message: incomingMessage, type} = incomingData;
      let newId = '';
      let outgoing = null;

      switch (type) {
        case 'GET_ID':
          // TODO: check if client already exist in list and have id
          // TODO: change to uuid
          // newId = Math.random().toString().slice(2);
          newId = idis.generate();

          ws.send(JSON.stringify({
            id: newId,
            type: 'SET_ID'
          }));
          break;

        case 'MESSAGE':
          // TODO: validate
          if (typeof id !== 'string' || id === '') {
            console.error('Crappy incoming id');
            return;
          }

          if (typeof incomingMessage !== 'string' || incomingMessage === '') {
            console.error('Crappy incoming message');
            return;
          }

          if (typeof name !== 'string' || name === '') {
            console.error('Crappy incoming name');
            return;
          }

          outgoing = JSON.stringify({
            id,
            name,
            message: incomingMessage,
            type
          });

          wss.clients.forEach((client) => {
            if (ws === client) {
              console.log('index of matched item ', wss.clients.indexOf(ws));
              return;
            }
            client.send(outgoing);
          });
          break;

        case 'IS_TYPING':
          if (typeof name !== 'string' || name === '') {
            console.error('Crappy incoming name of one who is typing');
            return;
          }

          outgoing = JSON.stringify({
            id,
            name,
            type
          });

          wss.clients.forEach((client) => {
            if (ws === client) {
              console.log('index of matched item ', wss.clients.indexOf(ws));
              return;
            }
            client.send(outgoing);
          });
          break;
        case 'JOIN_CHAT':
          break;
        case 'LEAVE_CHAT':
          break;
        case 'CHANGE_NAME':
          break;
        default:
          console.error('Unknown websocket message type, default case');
      }
    });

    ws.on('error', function sockerr(error) {
      // TODO: remove instances from sockets ?
      const brokenWsIndex = wss.clients.indexOf(ws);

      wss.clients.splice(brokenWsIndex, 1);

      console.error('in-wss cb socket error: ', error);
      console.error('in-wss error brokenWs index: ', brokenWsIndex);
    });

    // TODO: check close event presence
    ws.on('close', function closeWebSocket(closeEvent) {
      // TODO: remove instances from clients array; might be removed already
      console.log('in-wss close event ', closeEvent);
    });
  });
};

// TODO: export all functions separately with changed names for testing
module.exports = startWebsocket;
