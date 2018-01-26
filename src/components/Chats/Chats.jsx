import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import ChatsList from 'Chats/ChatsList';
import ChatContainer from 'containers/ChatContainer';

const propTypes = {
  chats: PropTypes.arrayOf(Object).isRequired
};

class Chats extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChatListItemClick = this.handleChatListItemClick.bind(this);
  }
  handleChatListItemClick(e, chatId) {
    const { history, match } = this.props;
    // console.dir(e);
    console.dir(chatId);
    console.log(match);

    // history.push(`${match.url}/:${chatId}`);
    history.push(`/chat/${chatId}`);
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
          <ChatsList chats={chats} onItemClick={this.handleChatListItemClick} />
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
