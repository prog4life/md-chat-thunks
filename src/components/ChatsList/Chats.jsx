import React, { PureComponent, Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import ChatContainer from 'containers/ChatContainer';
import ChatsList from './ChatsList';

const propTypes = {
  chats: PropTypes.arrayOf(Object).isRequired,
  clientId: PropTypes.string.isRequired,
};

class Chats extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChatListItemClick = this.handleChatListItemClick.bind(this);
    this.handleChatItemClose = this.handleChatItemClose.bind(this);
  }
  componentDidMount() {
    const { prepareWebsocketAndClientId } = this.props;
    prepareWebsocketAndClientId();
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
      // TODO: stop using shared css classes
      <div className="chats page">
        <div className="chats__container container">
          {/* <h3 className="chat__header">
            {'Chats Page'}
          </h3> */}
          <ChatsList
            chats={chats}
            onClose={this.handleChatItemClose}
            onItemClick={this.handleChatListItemClick}
          />
        </div>
        {/* <Route component={ChatContainer} exact path={`${match.url}`} /> */}
        <div className="test-picture" />
      </div>
    );
  }
}

// const Chats = props => (
//   <div className="chats">
//     <div className="container">
//       {/* <h3 className="chat__header">
//         {'Chats Page'}
//       </h3> */}
//       <ChatsList />
//     </div>
//     <div className="test-picture" />
//   </div>
// );

Chats.propTypes = propTypes;

export default Chats;
