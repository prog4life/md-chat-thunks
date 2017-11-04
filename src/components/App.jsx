import React from 'react';

import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import TypingNotification from './TypingNotification';
import createWebSocket from '../utils/websocket';
import typingNotifiConfig from '../config/typing-notification';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      messages: [
        {
          // TODO: add msg id using shortid
          clientId: '32425gser27408908',
          nickname: 'test user',
          text: 'Sample test user message'
        }
      ],
      whoIsTyping: []
    };

    this.websocketOpenHandler = this.websocketOpenHandler.bind(this);
    this.handleClearTyping = this.handleClearTyping.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  componentDidMount() {
    this.setupWebSocket();
    this.unsent = [];

    // TODO: resolve
    // this.monitorConnection();
  }
  componentDidUpdate(prevProps, prevState) {
    // TODO: check if it's better to place something into componentWillUpdate
    // TODO: check if calling it here is overkill
    // this.prepareConnection(() => console.log('componentDidUpdate conn ready'));
  }
  componentWillUnmount() {
    // TODO: resolve
    // clearInterval(this.monitoringTimerId);
  }
  setupWebSocket() {
    if (this.websocket &&
       (this.websocket.readyState === 0 || this.websocket.readyState === 1)) {
      console.log('readyState of ws in setupWebSocket: ', this.websocket.readyState);
      // this.websocket.close(1000, 'New connection opening is started');
      return;
    }
    this.websocket = createWebSocket({
      // TODO: replace bindings to constructor
      openHandler: this.websocketOpenHandler,
      closeHandler: this.websocketCloseHandler.bind(this),
      errorHandler: this.websocketErrorHandler.bind(this),
      saveClientId: this.incomingIdHandler.bind(this),
      addMessageToState: this.incomingMessageHandler.bind(this),
      addTypingDataToState: this.incomingTypingHandler.bind(this)
    });
  }
  getNewClientId() {
    this.websocket.send(JSON.stringify({ type: 'GET_ID' }));
  }
  postponeSending(outgoingData) {
    this.unsent = outgoingData.type === 'MESSAGE'
      ? [...this.unsent, outgoingData]
      : this.unsent;
  }
  sendUnsent() {
    // TODO: limit sending to last * messages
    this.unsent.forEach((msg) => {
      this.websocket.send(JSON.stringify(msg));
    });
    this.unsent = [];
  }
  handleSending(outgoingData) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      this.postponeSending(outgoingData);
      this.setupWebSocket();
      return;
    }

    if (!this.clientId) {
      this.postponeSending(outgoingData);
      this.getNewClientId();
      return;
    }
    this.websocket.send(JSON.stringify(outgoingData));
  }
  // NOTE: perhaps reopening connection on close is enough
  // monitorConnection() {
  //   // set timer that will track connection open state each ~ 5 sec and
  //   // will reopen it if needed
  //   this.monitoringTimerId = setInterval(() => {
  //     this.prepareConnection(() => console.log('Monitoring: connection ready'));
  //   }, 3000);
  // }
  incomingIdHandler(extractedData) {
    this.clientId = extractedData.clientId;
    console.log('New clientId: ', this.clientId);

    this.sendUnsent();
  }
  incomingMessageHandler(extractedData) {
    const { message } = extractedData;

    this.setState((prevState, props) => ({
      messages: message
        // NOTE: maybe replace with array + spread off:
        // [...prevState.messages, extractedData.message]
        ? prevState.messages.concat(message)
        : prevState.messages,
      // to terminate displaying of typing notification if new message
      // from same one is received
      whoIsTyping: prevState.whoIsTyping[0] === message.nickname
        ? []
        : prevState.whoIsTyping
    }));
  }
  incomingTypingHandler(extractedData) {
    this.setState((prevState, props) => ({
      whoIsTyping: extractedData.whoIsTyping || prevState.whoIsTyping
    }), () => {
      console.log('---------Incoming Typing Notification-----------');
    });
  }
  handleSendMessage(nickname, text) {
    // add message that is being sent to state for rendering
    this.setState(prevState => ({
      nickname,
      messages: prevState.messages.concat({
        clientId: this.clientId,
        nickname: 'Me',
        text
      })
    }));

    const outgoingMessage = {
      clientId: this.clientId,
      nickname,
      text,
      type: 'MESSAGE'
    };

    this.handleSending(outgoingMessage);
  }
  handleClearTyping() {
    // remove one, whose typing notification was shown, after showing it
    this.setState({
      whoIsTyping: []
    });
  }
  handleTyping() {
    if (this.state.nickname.length < 2) {
      return;
    }

    const outgoingTypingNotification = {
      clientId: this.clientId,
      nickname: this.state.nickname,
      type: 'IS_TYPING'
    };

    this.handleSending(outgoingTypingNotification);
  }
  websocketOpenHandler() {
    console.log('WebSocket is open, readyState: ', this.websocket.readyState);
    if (!this.clientId) {
      this.getNewClientId();
      return;
    }
    console.log(`Client has id: ${this.clientId}`);

    this.websocket.send(JSON.stringify({
      clientId: this.clientId,
      type: 'HAS_ID'
    }));

    this.sendUnsent();
  }
  websocketCloseHandler(event) {
    // TODO: recreate connection only at some user action or by monitorConnection
    // TODO: remove this condition
    if (event.code === 1006 || !event.wasClean) {
      this.setupWebSocket();
    }
  }
  websocketErrorHandler() {
    // TODO: recreate connection only at some user action or by monitorConnection
    // this.setupWebSocket();
  }
  render() {
    return (
      <div className="chat-app">
        <h3>Lil Chat</h3>
        <ChatHistory messages={this.state.messages} />
        <TypingNotification
          whoIsTyping={this.state.whoIsTyping}
          config={typingNotifiConfig}
          onStop={this.handleClearTyping}
        />
        <ChatInput
          onTyping={this.handleTyping}
          onSendMessage={this.handleSendMessage}
        />
      </div>
    );
  }
}
