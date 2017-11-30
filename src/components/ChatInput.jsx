import React from 'react';
import PropTypes from 'prop-types';
import TextFieldMaterial from './TextFieldMaterial';
import TextFieldGoogle from './TextFieldGoogle';

class ChatInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      messageText: ''
      // isNicknameFocused: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleNicknameFocusToggle = this.handleNicknameFocusToggle.bind(this);
  }
  // FIXME: resolve
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }
  handleSubmit(e) {
    e.preventDefault();
    const { nickname, messageText } = e.target.elements;
    const nicknameLength = nickname.value.length;
    const messageTextLength = messageText.value.length;

    if (nicknameLength < 2 || nicknameLength > 30) {
      nickname.focus();
      return;
    }

    if (messageTextLength < 1) {
      messageText.focus();
      return;
    }
    this.setState({ messageText: '' });
    this.props.onSendMessage(nickname.value, messageText.value);
  }
  handleInputChange(e) {
    const { name, value } = e.target;
    const { onTyping } = this.props;

    this.setState({
      [name]: value
    });
    // IDEA: typeof onTyping === 'function'
    if (name === 'messageText') {
      // onTyping();
    }
  }
  // handleNicknameFocusToggle(e) {
    // e.preventDefault();

    // this.setState(prevState => ({
    //   isNicknameFocused: !prevState.isNicknameFocused
    // }));
  // }
  render() {
    const { nickname, messageText } = this.state;

    return (
      <form
        className="chat-input"
        onSubmit={this.handleSubmit}
      >
        <TextFieldGoogle
          placeholder={'Input field with bottom border animation'}
        />
        {/* <TextFieldMaterial
          // onChange={this.handleInputChange}
          placeholder={'Your nickname (from 2 to 30 characters)'}
          // value={nickname}
          // wrongInputMsg={'sample wrong input message'}
        /> */}
        {/* <TextFieldMaterialDumb
          isFocused={isNicknameFocused}
          onChange={this.handleInputChange}
          onFocusToggle={this.handleNicknameFocusToggle}
          placeholder={'Your nickname (from 2 to 30 characters)'}
          value={nickname}
          wrongInputMsg={'sample wrong input message'}
        /> */}
        <div className="message">
          <textarea
            className="message-field"
            name="messageText"
            onChange={this.handleInputChange}
            placeholder="Write your message here"
            required
            rows="5"
            value={messageText}
          />
        </div>
        <button
          className="send-button"
          type="submit"
        >
          { 'SEND' }
        </button>
      </form>
    );
  }
}

// TODO: add default empty handler for onTyping
ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onTyping: PropTypes.func.isRequired
};

export default ChatInput;
