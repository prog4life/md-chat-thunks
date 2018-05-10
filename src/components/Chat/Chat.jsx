import React from 'react';
import PropTypes from 'prop-types';

import typingNotifConfig from 'config/typing-notification';
import ChatHistory from './ChatHistory';
import ChatForm from './ChatForm';
import TypingNotification from './TypingNotification';

class Chat extends React.Component {
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
    const { stopMonitoring } = this.props;
    // stopMonitoring();
    // TODO: terminate websocket
  }
  handleSendMessage(text) {
    const { sendMessage } = this.props;
    sendMessage(text);
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
      // TODO: stop using shared css classes
      <div className="chat page">
        <div className="chat__container container">
          {/* TODO: stop using shared css classes */}
          <section className="chat__section paper">
            {/* <h3 className="chat__header">
              { 'LIL CHAT' }
            </h3> */}
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
          </section>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  clientId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  nickname: PropTypes.string.isRequired,
  whoIsTyping: PropTypes.string.isRequired
};

export default Chat;
