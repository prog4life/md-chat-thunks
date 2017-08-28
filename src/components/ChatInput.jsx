import React from 'react';
import PropTypes from 'prop-types';

class ChatInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    const nickname = event.target.nickname.value;
    const messageText = event.target.messageText.value;

    if (nickname.length < 2 || nickname.length > 30) {
      event.target.nickname.focus();
      return;
    }

    if (messageText.length < 1) {
      event.target.messageText.focus();
      return;
    }
    event.target.messageText.value = '';
    this.props.onSendMessage(nickname, messageText);
  }
  render() {
    return (
      <form
        className="chat-input"
        onSubmit={this.handleSubmit}
      >
        <input
          className="nickname"
          name="nickname"
          type="text"
          title="Nickname length must be from 2 to 30 characters"
          placeholder="Your nickname"
        />
        <textarea
          className="message-text"
          name="messageText"
          rows="5"
          required
          onChange={this.props.onTyping}
          placeholder="Write your message here"
        />
        <button className="send-button">
          SEND
        </button>
      </form>
    );
  }
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onTyping: PropTypes.func.isRequired
};

export default ChatInput;
