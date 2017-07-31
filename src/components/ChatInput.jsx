import React from 'react';

class ChatInput extends React.Component {
  onClickSend(event) {
    event.preventDefault();
    const nickname = this.refs.nickname.value;
    const message = this.refs.message.value;

    if (nickname.length < 1 || nickname.length > 30) {
      alert('Nickname is too short or too long (max 30 letters)');
      this.refs.nickname.focus();
      return;
    }

    if (message.length < 1) {
      alert('Message is too short (min 1 letter)');
      this.refs.message.focus();
      return;
    }
    this.refs.message.value = '';
    this.props.onSendMessage(nickname, message);
  }
  render() {
    return (
      <div className="chat-input">
        <input className="nickname" ref="nickname" type="text"
          placeholder="Your nickname"/>
        <textarea className="message-text" ref="message" rows="5" required
          onChange={this.props.onTyping}
          placeholder="Write your message here">
        </textarea>
        <button className="send-button"
          onClick={this.onClickSend.bind(this)}>SEND</button>
      </div>
    );
  }
}

export default ChatInput;
