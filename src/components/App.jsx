import React from 'react';
import shortid from 'shortid';

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
      whoIsTyping: [],
      isTypingAnimationOn: false,
      animationConfig: {
        placeholderText: 'No one is typing',
        textToShow: '', // TODO: consider: `${whoIsTyping[0]} is typing`
        repeats: 3,
        duration: 1800,
        // opacity change step(must: 1 / step === 'integer'), it affects amount
        // of steps to change element opacity from 0 to 1 or back, can be one
        // of: [0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5, 1]
        step: 0.04,
        bidirectional: true
      }
      // isTypingQueue: [
      //   {
      //     nickname: 'as obj',
      //     timestamp: 1356547547
      //   }
      // ]
    };

    this.handleTypingAnimationSwitch =
      this.handleTypingAnimationSwitch.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    startWs((websocket) => {
      this.setState({
        websocket
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('New state', this.state);
    // console.log('prevProps ', prevProps);
    // console.log('prevState ', prevState);
    if (this.state.websocket === prevState.websocket) {
      return;
    }
    // TODO: consider replacing by Promise
    if (this.state.websocket && !this.state.websocket.onmessage) {
      setOnMessageHandler(this.state.websocket, (error, stateUpdates) => {
        this.setState({
          id: stateUpdates.id || this.state.id,
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
      nickname, // TODO: check if nickname was changed, do not overwrite if yes
      messages: this.state.messages.concat({
        id: this.state.id,
        isNotification: false,
        nickname: 'Me',
        message
      })
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
      <ChatMessage key={shortid.generate()} {...message} />));
  }
  handleTypingAnimationSwitch() {
    // remove one, whose typing notification was shown, after showing it
    this.setState({
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
        <ChatHistory
          messages={this.state.messages}>
          {this.renderMessageList()}
        </ChatHistory>
        <TypingNotification
          whoIsTyping={this.state.whoIsTyping}
          isTypingAnimationOn={this.state.isTypingAnimationOn}
          animationConfig={this.state.animationConfig}
          onAnimationSwitch={this.handleTypingAnimationSwitch}
        />
        <ChatInput
          onTyping={this.handleTyping}
          onSendMessage={this.sendMessage}
        />
      </div>
    );
  }
}
