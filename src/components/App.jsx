import React from 'react';
import { connect } from 'react-redux';

// TODO: try to import files relative to src/, without .., as src is added
// to modules in webpack's resolve
import {
  prepareWebsocketAndClientId,
  sendMessage,
  sendTyping,
  stopTypingNotification,
  startMonitoring,
  stopPing
} from 'actions';
import typingNotifConfig from 'config/typing-notification';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import TypingNotification from './TypingNotification';

export class App extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   nickname: '',
    //   messages: [
    //     {
    //       // TODO: add msg id using shortid
    //       clientId: '32425gser27408908',
    //       nickname: 'test user',
    //       text: 'Sample test user message'
    //     }
    //   ],
    //   whoIsTyping: ''
    // };

    this.handleTypingNotifEnd = this.handleTypingNotifEnd.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  componentDidMount() {
    // TODO: think over dispatching checkWebsocketAndClientId first
    this.websocket = this.props.dispatch(prepareWebsocketAndClientId);
    this.unsent = [];
    // TODO: resolve
    this.props.dispatch(startMonitoring);
  }
  componentDidUpdate(prevProps, prevState) {
    // this.props.dispatch(prepareWebsocketAndClientId);
    // TODO: this.props.dispatch(sendPendingData());

    // TODO: check if it's better to place something into componentWillUpdate
  }
  componentWillUnmount() {
    // TODO: doublecheck, resolve
    this.props.dispatch(stopPing);
    // TODO: terminate websocket
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
  handleSendMessage(nickname, text) {
    this.props.dispatch(sendMessage(nickname, text));
  }
  handleTypingNotifEnd() {
    // remove one, whose typing notification was shown, after showing it
    this.props.dispatch(stopTypingNotification());
  }
  handleTyping() {
    // TODO: replace into actionCreator ?
    const { nickname, dispatch } = this.props;
    if (nickname.length < 2) {
      return;
    }
    dispatch(sendTyping);
  }
  // websocketOpenHandler() {
  //   console.log('WebSocket is open, readyState: ', this.websocket.readyState);
  //   if (!this.clientId) {
  //     this.getNewClientId();
  //     return;
  //   }
  //   console.log(`Client has id: ${this.clientId}`);
  //
  //   this.websocket.send(JSON.stringify({
  //     clientId: this.clientId,
  //     type: 'HAS_ID'
  //   }));
  //
  //   this.sendUnsent();
  // }
  // websocketCloseHandler(event) {
  //   // TODO: recreate connection only at some user action or by monitorConnection
  //   // TODO: remove this condition
  //   if (event.code === 1006 || !event.wasClean) {
  //     this.setupWebSocket();
  //   }
  // }
  // websocketErrorHandler() {
  //   // TODO: recreate connection only at some user action or by monitorConnection
  //   // this.setupWebSocket();
  // }
  render() {
    return (
      <div className="chat-app wrapper">
        <h3>
          { 'Lil Chat' }
        </h3>
        <ChatHistory messages={this.props.messages} />
        <TypingNotification
          config={typingNotifConfig}
          onNotificationEnd={this.handleTypingNotifEnd}
          whoIsTyping={this.props.whoIsTyping}
        />
        <ChatInput
          onSendMessage={this.handleSendMessage}
          onTyping={this.handleTyping}
        />
      </div>
    );
  }
}

export default connect(state => ({
  websocketStatus: state.websocketStatus,
  nickname: state.nickname,
  clientId: state.clientId,
  messages: state.messages,
  whoIsTyping: state.whoIsTyping
}))(App);
