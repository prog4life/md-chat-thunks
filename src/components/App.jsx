import React from 'react';
import shortid from 'shortid';

import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import TypingNotification from './TypingNotification';
import startWebSocket, {setOnMessageHandler} from '../api/websocket';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '005',
      nickname: '',
      messages: [
        {
          id: '32425gser27408908',
          nickname: 'test user',
          text: 'Sample test user message'
        }
      ],
      whoIsTyping: [],
      animationConfig: {
        placeholderText: 'No one is typing',
        textToShow: '', // TODO: try: `${whoIsTyping[0]} is typing` or getter
        repeats: 2,
        duration: 1800,
        // opacity change step(must: 1 / step === 'integer'), it affects amount
        // of steps to change element opacity from 0 to 1 or back, can be one
        // of: [0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5, 1]
        step: 0.5,
        bidirectional: true
      }
    };

    this.handleTypingAnimationEnd = this.handleTypingAnimationEnd.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    startWebSocket((websocket) => {
      this.setState({
        websocket
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const {websocket, messages} = this.state;
    // console.log('prevState ', prevState);
    if (websocket.readyState === WebSocket.OPEN) {
      clearTimeout(this.websocketTimeoutId);
    }
    if (websocket.readyState !== WebSocket.OPEN) { // TODO: add no id condition
      console.log('webscoket readystate is not OPEN');

      this.websocketTimeoutId = setTimeout(() => {
        startWebSocket((websocket) => {
          this.setState({
            websocket
          });
        });
      }, 1000);
    }
    // if same socket - no need to set handlers
    if (websocket === prevState.websocket) {
      return;
    }
    // TODO: consider replacing by Promise
    if (websocket && !websocket.onmessage) {
      setOnMessageHandler(websocket, (stateUpdates) => {
        const newStatePart = {};

        Object.keys(stateUpdates).forEach((prop) => {
          if (prop === 'message') {
            newStatePart.messages = messages.concat(stateUpdates.message);
            return;
          }
          newStatePart[prop] = stateUpdates[prop];
        });
        this.setState(newStatePart);
        // previos version of state updating
        // this.setState({
        //   id: stateUpdates.id || this.state.id,
        //   messages: stateUpdates.message
        //     ? messages.concat(stateUpdates.message)
        //     : messages,
        //   whoIsTyping: stateUpdates.whoIsTyping || this.state.whoIsTyping
        // });
      });
    }
  }
  sendMessage(nickname, text) {
    // save new message to state
    this.setState({
      nickname, // TODO: overwrite nickname only if its value has changed
      messages: this.state.messages.concat({
        id: this.state.id,
        isNotification: false,
        nickname: 'Me',
        text
      })
    });
    // TODO: check if socket readyState is OPEN, create connection if not
    this.state.websocket.send(JSON.stringify({
      id: this.state.id,
      name: nickname,
      text,
      type: 'MESSAGE'
    }));
  }
  renderMessageList() {
    return this.state.messages.map((message) => (
      // TODO: replace key value by client id from message
      <ChatMessage key={shortid.generate()} {...message} />));
  }
  handleTypingAnimationEnd() {
    // remove one, whose typing notification was shown, after showing it
    this.setState({
      whoIsTyping: []
    });
  }
  handleTyping(event) {
    if (this.state.nickname.length < 2) {
      return;
    }
    this.state.websocket.send(JSON.stringify({
      id: this.state.id,
      name: this.state.nickname,
      type: 'IS_TYPING'
    }));
  }
  render() {
    return (
      <div className="chat-app">
        <h3>Lil Chat</h3>
        <ChatHistory messages={this.state.messages}>
          {this.renderMessageList()}
        </ChatHistory>
        <TypingNotification
          whoIsTyping={this.state.whoIsTyping}
          config={this.state.animationConfig}
          onStop={this.handleTypingAnimationEnd}
        />
        <ChatInput
          onTyping={this.handleTyping}
          handleSendMessage={this.sendMessage}
        />
      </div>
    );
  }
}
