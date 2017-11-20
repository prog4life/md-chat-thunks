import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import ChatMessage from './ChatMessage';

class ChatHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrollToLastActive: true
    };
  }
  componentDidMount() {
    this.historyElem.scrollTop = this.historyElem.scrollHeight;
  }
  // TODO: block scrolling to last added message when user interact with list
  // and restore scrolling when user scrolls to last message by itself
  componentDidUpdate(prevProps) {
    if (this.props.messages.length > prevProps.messages.length &&
        this.state.isScrollToLastActive) {
      this.historyElem.scrollTop = this.historyElem.scrollHeight;
    }
  }
  renderMessageList() {
    return this.props.messages.map(message => (
      // TODO: replace key value by client id from message
      <ChatMessage key={shortid.generate()} {...message} />
    ));
  }
  render() {
    return (
      <div
        ref={(thisDiv) => { this.historyElem = thisDiv; }}
        className="chat-history"
      >
        {this.renderMessageList()}
      </div>
    );
  }
}

export default ChatHistory;

ChatHistory.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
};
