import React from 'react';
import PropTypes from 'prop-types';

class ChatInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      messageText: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const {nickname, messageText} = this.state;
    const formElems = e.target.elements;

    if (nickname.length < 2 || nickname.length > 30) {
      formElems.nickname.focus();
      return;
    }

    if (messageText.length < 1) {
      formElems.messageText.focus();
      return;
    }
    this.setState({
      messageText: ''
    });
    this.props.onSendMessage(nickname, messageText);
  }
  handleInputChange(e) {
    /* eslint react/no-unused-state: 0 */
    const {name, value} = e.target;

    this.setState({
      [name]: value
    });
    if (name === 'messageText') {
      this.props.onTyping();
    }
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
          value={this.state.nickname}
          placeholder="Your nickname (from 2 to 30 characters)"
          onChange={this.handleInputChange}
        />
        <textarea
          className="message-text"
          name="messageText"
          rows="5"
          required
          value={this.state.messageText}
          placeholder="Write your message here"
          onChange={this.handleInputChange}
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
