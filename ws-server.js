const websocket = require('ws');

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

      if (!incomingData.id) {
        // check if client already exist in list and have id

        const id = Math.random().toString().slice(2);

        incomingData.id = id;

        // variant 1: send back only new id, client will show message stored
        // by himself (if present)
        ws.send(JSON.stringify({ id }));

        // variant 2: send back new id with message received from client
        // (if any); client then will show them both
        // ws.send(JSON.stringify(incomingData));
        console.log('sent new id ', id);
      }

      if (incomingData.message) {
        wss.clients.forEach((client) => {
          if (ws === client) {
            console.log('index of matched item ', wss.clients.indexOf(ws));
            return;
          }
          client.send(JSON.stringify(incomingData));
        });
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
    ws.on('close', function closeWebocket(closeEvent) {
      // TODO: remove instances from clients array; might be removed already
      console.log('in-wss close event ', closeEvent);
    });
  });
};

module.exports = startWebsocket;
