import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import ChatHistoryMsg from './ChatHistoryMsg';

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
    const { messages } = this.props;
    const { isScrollToLastActive } = this.state;

    if (messages.length > prevProps.messages.length && isScrollToLastActive) {
      this.historyElem.scrollTop = this.historyElem.scrollHeight;
    }
  }
  renderMessageList() {
    const { messages } = this.props;

    return messages.map(message => (
      <ChatHistoryMsg key={shortid.generate()} {...message} />
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

ChatHistory.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ChatHistory;
