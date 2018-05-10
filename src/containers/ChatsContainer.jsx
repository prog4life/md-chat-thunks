import { connect } from 'react-redux';

import { prepareWebsocketAndClientId, deleteChat } from 'actions';
// import Chats from 'components/Chats';
import ChatsList from 'components/ChatsList';

const mapStateToProps = ({ clientId, chats }) => ({
  clientId,
  chats,
});

export default connect(
  mapStateToProps,
  {
    prepareWebsocketAndClientId,
    deleteChat,
  },
)(ChatsList);
