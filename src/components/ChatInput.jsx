import React from 'react';
import PropTypes from 'prop-types';

class ChatInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleClickSend = this.handleClickSend.bind(this);
  }
  handleClickSend(event) {
    event.preventDefault();
    const nickname = this.refs.nickname.value;
    const messageText = this.refs.messageText.value;

    if (nickname.length < 2 || nickname.length > 30) {
      alert('Nickname is too short or too long (min: 2 and max: 30 letters)');
      this.refs.nickname.focus();
      return;
    }

    if (messageText.length < 1) {
      this.refs.messageText.focus();
      return;
    }
    this.refs.messageText.value = '';
    this.props.onSendMessage(nickname, messageText);
  }
  render() {
    return (
      <div className="chat-input">
        <input
          className="nickname"
          ref="nickname"
          type="text"
          placeholder="Your nickname"
        />
        <textarea
          className="message-text"
          ref="messageText"
          rows="5" required
          onChange={this.props.onTyping}
          placeholder="Write your message here"
        />
        <button
          className="send-button"
          onClick={this.handleClickSend}
        >
          SEND
        </button>
      </div>
    );
  }
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onTyping: PropTypes.func.isRequired
};

export default ChatInput;
