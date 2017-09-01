import React from 'react';

import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import TypingNotification from './TypingNotification';
import createWebSocket, {
  addOnMessageListener,
  addOnCloseListener,
  addOnErrorListener
} from '../api/websocket';
import animationConfig from '../helpers/animation';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      messages: [
        {
          id: '32425gser27408908',
          nickname: 'test user',
          text: 'Sample test user message'
        }
      ],
      whoIsTyping: []
    };

    this.handleTypingAnimationEnd = this.handleTypingAnimationEnd.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  componentDidMount() {
    this.setupWebSocket(() => {
      this.checkId((id) => console.log('Checked id: ', id));
    });
    // this.monitorConnection();
  }
  componentDidUpdate(prevProps, prevState) {
    // TODO: check if it's better to place something into componentWillUpdate
    // TODO: check if calling it here is overkill
    // this.prepareConnection(() => console.log('componentDidUpdate conn ready'));
  }
  componentWillUnmount() {
    // doublecheck
    clearInterval(this.websocketIntervalId);
    // TODO: resolve
    // clearInterval(this.monitoringTimerId);
  }
  prepareConnection(onReady) {
    if (this.websocket.readyState !== WebSocket.OPEN) {
      console.log('webscoket readystate is not OPEN');
      // TODO: consider passing checkId and onReady directly as param
      this.setupWebSocket((websocket) => {
        this.checkId((id) => {
          console.log('Check id in prepareConnection', id);
          onReady();
        });
      });
      return;
    }

    if (!this.clientId) {
      console.log('webscoket readystate is OPEN, but no id');
      this.getNewId((id) => {
        console.log('Received new id in prepareConnection: ', id);
        onReady();
      });
      return;
    }
    onReady();
  }
  setupWebSocket(done) {
    const handleOpen = (websocket) => {
      // this.websocket = websocket;
      // TODO: bind this or wrap into arrow function
      addOnMessageListener(websocket, {
        messageHandler: this.incomingMessageHandler.bind(this),
        typingHandler: this.incomingTypingHandler.bind(this)
      });
      addOnCloseListener(websocket, () => {
        this.setupWebSocket(() => {
          this.checkId((id) => {
            console.log('Reopen on close with id:', id);
          });
        });
      });
      // TODO: check if function passed
      done(websocket);
    };

    this.websocket = createWebSocket(handleOpen);

    addOnErrorListener(this.websocket, () => {
      if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
        this.websocket.close();
      }
      this.setupWebSocket(() => {
        this.checkId((id) => {
          console.log('Reopen on error with id:', id);
        });
      });
    });

    // openWebSocket(handleOpen);
    // TODO: prevent multiple intervals without refs(ids) creation
    // this.websocketIntervalId = setInterval(() => {
    //   if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
    //     clearInterval(this.websocketIntervalId);
    //     return;
    //   }
    //   // to close pending websocket, that was left after prior opening attempt
    //   // this.websocket = null;
    //   openWebSocket(handleOpen);
    // }, 1000);
  }
  // NOTE: perhaps reopening connection on close is enough
  monitorConnection() {
    // TODO: set Timer that will track connection open state each ~ 5 sec and
    // will reopen it if needed
    this.monitoringTimerId = setInterval(() => {
      this.prepareConnection(() =>
        console.log('Monitoring: connection ready')
      );
    }, 5000);
  }
  checkId(done) {
    if (this.clientId) {
      this.websocket.send(JSON.stringify({
        id: this.clientId,
        type: 'HAS_ID'
      }));
      // TODO: check if function passed
      done(this.clientId);
    } else {
      this.getNewId(done);
    }
  }
  getNewId(done) {
    addOnMessageListener(this.websocket, {
      // immediate call, returned handler function with done in closure
      idHandler: this.incomingIdHandler(done)
    });
    this.websocket.send(JSON.stringify({
      type: 'GET_ID'
    }));
  }
  incomingIdHandler(done) {
    return (extractedData) => {
      this.clientId = extractedData.id;
      // TODO: check if function passed
      done(extractedData.id);
    };
  }
  incomingMessageHandler(extractedData) {
    this.setState((prevState, props) => {
      return {
        messages: extractedData.message
          // NOTE: maybe replace with array + spread off:
          // [...prevState.messages, extractedData.message]
          ? prevState.messages.concat(extractedData.message)
          : prevState.messages
      };
    });
  }
  incomingTypingHandler(extractedData) {
    this.setState((prevState, props) => {
      return {
        whoIsTyping: extractedData.whoIsTyping || prevState.whoIsTyping
      };
    });
  }
  handleSendMessage(nickname, text) {
    // TODO: try currying here = id => () => { }
    const saveAndSend = () => {
      // save sent message to state for rendering
      // TODO: use functional setState
      this.setState({
        nickname,
        messages: this.state.messages.concat({
          id: this.clientId,
          isNotification: false,
          nickname: 'Me',
          text
        })
      });
      const outgoingData = {
        id: this.clientId,
        name: nickname,
        text,
        type: 'MESSAGE'
      };

      this.websocket.send(JSON.stringify(outgoingData));
    };

    // IDEA: store outgoing as this.unsent [], check it in componentDidUpdate
    // and send all data if not empty + clear array

    this.prepareConnection(saveAndSend);
  }
  handleTypingAnimationEnd() {
    // remove one, whose typing notification was shown, after showing it
    this.setState({
      whoIsTyping: []
    });
  }
  handleTyping() {
    if (this.state.nickname.length < 2) {
      return;
    }

    const sendTyping = () => {
      this.websocket.send(JSON.stringify({
        id: this.clientId,
        name: this.state.nickname,
        type: 'IS_TYPING'
      }));
    };

    this.prepareConnection(sendTyping);
  }
  render() {
    return (
      <div className="chat-app">
        <h3>Lil Chat</h3>
        <ChatHistory messages={this.state.messages} />
        <TypingNotification
          whoIsTyping={this.state.whoIsTyping}
          config={animationConfig}
          onStop={this.handleTypingAnimationEnd}
        />
        <ChatInput
          onTyping={this.handleTyping}
          onSendMessage={this.handleSendMessage}
        />
      </div>
    );
  }
}
