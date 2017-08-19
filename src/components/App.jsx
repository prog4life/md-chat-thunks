import React from 'react';
import shortid from 'shortid';

import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import TypingNotification from './TypingNotification';
import openWebSocket, {setOnMessageHandler} from '../api/websocket';
import animationConfig from '../helpers/animation';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: remove from state
      id: '005',
      nickname: '',
      // TODO: change to form in ChatInput and make it controlled
      messageText: '',
      messages: [
        {
          id: '32425gser27408908',
          nickname: 'test user',
          text: 'Sample test user message'
        }
      ],
      // TODO: remove from state ?
      whoIsTyping: []
    };

    this.handleTypingAnimationEnd = this.handleTypingAnimationEnd.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  componentDidMount() {
    this.startWebSocket();
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('prevState ', prevState);
    // TODO: add no id condition
    if (this.websocket.readyState !== WebSocket.OPEN) {
      console.log('webscoket readystate is not OPEN');
      this.startWebSocket();
    }
    // NOTE: not needed more; if same socket - no need to set handlers
    // if (this.websocket === prevState.websocket) {
    //   return;
    // }
    // safety doublecheck
    if (this.websocket.readyState === WebSocket.OPEN) {
      clearInterval(this.websocketIntervalId);
    }
  }
  startWebSocket(done) {
    const handleOpen = (websocket) => {
      this.websocket = websocket;
      this.addWebSocketHandlers();
      if (typeof done === 'function') {
        done(websocket);
      }
    };

    openWebSocket(handleOpen);

    this.websocketIntervalId = setInterval(() => {
      if (this.websocket.readyState === WebSocket.OPEN) {
        clearInterval(this.websocketIntervalId);
        return;
      }
      openWebSocket(handleOpen);
    }, 1000);
  }
  addWebSocketHandlers() {
    // TODO: consider replacing by Promise
    setOnMessageHandler(this.websocket, (receivedData) => {
      // TEMP: alternative version of state updating
      // const newStatePart = {};

      // Object.keys(receivedData).forEach((prop) => {
      //   if (prop === 'message') {
      //     newStatePart.messages = messages.concat(receivedData.message);
      //     return;
      //   }
      //   newStatePart[prop] = receivedData[prop];
      // });
      // this.setState(newStatePart);
      this.setState((prevState, props) => {
        return {
          id: receivedData.id || this.state.id,
          messages: receivedData.message
            ? prevState.messages.concat(receivedData.message)
            : prevState.messages,
          whoIsTyping: receivedData.whoIsTyping || this.state.whoIsTyping
        };
      });
    });
  }
  handleSendMessage(nickname, text) {
    // save sent message to state for rendering
    this.setState({
      nickname,
      messages: this.state.messages.concat({
        id: this.state.id, // NOTE: perhaps must use guaranteedly updated id
        isNotification: false,
        nickname: 'Me',
        text
      })
    });

    const outgoingData = {
      id: this.state.id,
      name: nickname,
      text,
      type: 'MESSAGE'
    };

    // TODO: check if socket readyState is OPEN, create connection if not
    // NOTE: can check for new message in componentDidUpdate and send from there
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(outgoingData));
    } else {
      this.startWebSocket((websocket) => {
        websocket.send(JSON.stringify(outgoingData));
      });
    }
  }
  // sendData(data) {
  //   this.websocket.send(JSON.stringify(data));
  // }
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
    this.websocket.send(JSON.stringify({
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
