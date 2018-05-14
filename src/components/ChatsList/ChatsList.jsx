import React, { PureComponent, Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import { ListGroup, ListGroupItem } from 'reactstrap';

import ChatPreview from './ChatPreview';

const propTypes = {
  chats: PropTypes.arrayOf(Object).isRequired,
  clientId: PropTypes.string.isRequired,
  deleteChat: PropTypes.func.isRequired,
  // prepareWebsocketAndClientId: PropTypes.func.isRequired,
};

class ChatsList extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChatListItemClick = this.handleChatListItemClick.bind(this);
    this.handleChatItemClose = this.handleChatItemClose.bind(this);
  }
  componentDidMount() {
    // const { prepareWebsocketAndClientId } = this.props;
    // prepareWebsocketAndClientId();
  }
  handleChatListItemClick(e, chatId) {
    const { history, match } = this.props;
    console.dir(e.target);
    console.dir(chatId);
    console.log(match);

    // history.push(`${match.url}/:${chatId}`);
    history.push(`/chat/${chatId}`);
  }
  handleChatItemClose(e, chatId) {
    e.stopPropagation();
    const { clientId, deleteChat } = this.props;

    console.dir(e.target, chatId);
    deleteChat(chatId, clientId);
  }
  render() {
    const { chats } = this.props;
    return (
      <ListGroup>
        {chats.map((chat) => {
          return (
            <ListGroupItem key={shortId.generate()}>
              <ChatPreview
                chat={chat}
                onClose={this.handleChatItemClose}
                onItemClick={this.handleChatListItemClick}
              />
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  }
}

ChatsList.propTypes = propTypes;

export default ChatsList;
