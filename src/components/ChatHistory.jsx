import React from 'react';

class ChatHistory extends React.Component {
  componentDidMount() {
    this.historyNode.scrollTop = this.historyNode.scrollHeight;
  }
  componentDidUpdate() {
    this.historyNode.scrollTop = this.historyNode.scrollHeight;
  }
  render() {
    return (
      <div
        className="chat-history"
        ref={(thisDiv) => (this.historyNode = thisDiv)}
      >
        {this.props.children}
      </div>
    );
  }
}

export default ChatHistory;
