import React from 'react';
import idis from 'short-id';

import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import TypingNotification from './TypingNotification';
import startWs, {setOnMessageHandler} from '../api/websocket';

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
          message: 'Sample test user message'
        }
      ],
      whoIsTyping: []
      // isTypingQueue: [
      //   {
      //     nickname: 'as obj',
      //     timestamp: 1356547547
      //   }
      // ]
    };
  }
  componentDidMount() {
    startWs((websocket) => {
      this.setState({
        websocket
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('New state', this.state);
    // console.log('prevProps ', prevProps);
    // console.log('prevState ', prevState);
    if (this.state.websocket === prevState.websocket) {
      return;
    }
    if (this.state.websocket && !this.state.websocket.onmessage) {
      setOnMessageHandler(this.state.websocket, (error, stateUpdates) => {
        this.setState({
          // ...this.state,
          id: stateUpdates.id || this.state.id,
          websocket: this.state.websocket,
          nickname: this.state.nickname,
          messages: stateUpdates.message
            ? this.state.messages.concat(stateUpdates.message)
            : this.state.messages,
          whoIsTyping: stateUpdates.whoIsTyping || this.state.whoIsTyping
          // participants: 43
        });
      });
    }
  }
  sendMessage(nickname, message) {
    // TODO: try set state in shorter way, 1 of next 2
    // const newState = {};
    //
    // Object.keys(this.state).forEach((key) => {
    //   newState[key] = this.state[key]
    // });

    // Object.assign(newState, this.state);

    // save new message to state
    this.setState({
      id: this.state.id,
      websocket: this.state.websocket,
      nickname,
      messages: this.state.messages.concat({
        id: this.state.id,
        isNotification: false,
        nickname: 'Me',
        message
      }),
      whoIsTyping: this.state.whoIsTyping
      // participants: 43
    });

    // send new message with nickname through websocket
    this.state.websocket.send(JSON.stringify({
      id: this.state.id,
      name: nickname,
      message,
      type: 'MESSAGE'
    }));
  }
  renderMessageList() {
    return this.state.messages.map((message) => (
      // TODO: replace by id client from message
      <ChatMessage key={idis.generate()} {...message} />));
  }
  handleShowTyping() {
    // remove one, whose typing notification was shown, after showing it
    this.setState({
      id: this.state.id,
      websocket: this.state.websocket,
      nickname: this.state.nickname,
      messages: this.state.messages,
      whoIsTyping: []
      // participants: 43
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
        <TypingNotification whoIsTyping={this.state.whoIsTyping}
          onShowing={this.handleShowTyping.bind(this)}/>
        <ChatInput onTyping={this.handleTyping.bind(this)}
          onSendMessage={this.sendMessage.bind(this)} />
      </div>
    );
  }
}
