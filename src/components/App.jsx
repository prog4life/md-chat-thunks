import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

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

import { filterMessages } from 'selectors/messages';

import typingNotifConfig from 'config/typing-notification';
import ChatHistory from './ChatHistory';
import ChatForm from './ChatForm';
import TypingNotification from './TypingNotification';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleTypingNotifEnd = this.handleTypingNotifEnd.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }
  componentDidMount() {
    const { prepareWebsocketAndClientId } = this.props;
    prepareWebsocketAndClientId();
    // TODO: resolve
    // this.props.startMonitoring();
  }
  // TEMP
  shouldComponentUpdate(nextProps) {
    return true;
  }
  componentWillUnmount() {
    const { stopPing } = this.props;
    stopPing();
    // TODO: terminate websocket
  }
  handleSendMessage(nickname, text) {
    const { sendMessage } = this.props;
    sendMessage(nickname, text);
  }
  handleTypingNotifEnd() {
    const { stopTypingNotification } = this.props;
    // cleares whoIsTyping, after notification was shown
    stopTypingNotification();
  }
  // NOTE: handleTyping(nickname) {
  handleTyping() {
    // TODO: add throttling
    const { sendTyping, nickname, clientId } = this.props;
    sendTyping(nickname, clientId);
  }
  render() {
    const { messages, whoIsTyping } = this.props;
    return (
      <div className="chat container">
        <h3 className="chat__header">
          { 'LIL CHAT' }
        </h3>
        <ChatHistory messages={messages} />
        <TypingNotification
          config={typingNotifConfig}
          onNotificationEnd={this.handleTypingNotifEnd}
          whoIsTyping={whoIsTyping}
        />
        <ChatForm
          onSendMessage={this.handleSendMessage}
          onTyping={this.handleTyping}
        />
      </div>
    );
  }
}

App.propTypes = {
  clientId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  nickname: PropTypes.string.isRequired,
  whoIsTyping: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  websocketStatus: state.websocketStatus,
  nickname: state.nickname,
  clientId: state.clientId,
  messages: filterMessages(state.messages),
  whoIsTyping: state.whoIsTyping
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    prepareWebsocketAndClientId,
    sendMessage,
    sendTyping,
    stopTypingNotification,
    startMonitoring,
    stopPing
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
