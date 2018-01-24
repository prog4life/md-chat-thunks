import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import ChatsList from './ChatsList';
import ChatContainer from './Chat';

class Chats extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChatListItemClick = this.handleChatListItemClick.bind(this);
  }
  handleChatListItemClick(e) {
    const { history, match } = this.props;
    console.dir(e.target);
    console.log(match);

    // history.push(`${match.url}/:${chatId}`);
    history.push('/chat/test-id');
  }
  render() {
    const { match } = this.props;
    return (
      <div className="chats page">
        <div className="chats__container container">
          {/* <h3 className="chat__header">
            {'Chats Page'}
          </h3> */}
          <ChatsList onItemClick={this.handleChatListItemClick} />
        </div>
        {/* <Route component={ChatContainer} exact path={`${match.url}`} /> */}
        <div className="test-picture" />
      </div>
    )
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

export default Chats;
