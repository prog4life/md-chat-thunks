import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import ChatMessage from './ChatMessage';

class ChatHistory extends React.Component {
  componentDidMount() {
    this.historyNode.scrollTop = this.historyNode.scrollHeight;
  }
  componentDidUpdate() {
    this.historyNode.scrollTop = this.historyNode.scrollHeight;
  }
  renderMessageList() {
    return this.props.messages.map((message) => (
      // TODO: replace key value by client id from message
      <ChatMessage key={shortid.generate()} {...message} />
    ));
  }
  render() {
    return (
      <div
        className="chat-history"
        ref={(thisDiv) => (this.historyNode = thisDiv)}
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
