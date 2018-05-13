import { connect } from 'react-redux';

import { prepareWebsocketAndClientId, deleteChat } from 'actions';
import { getClientId, getChats } from 'reducers';
// import Chats from 'components/Chats';
import ChatsList from 'components/ChatsList';

const mapStateToProps = state => ({
  clientId: getClientId(state),
  chats: getChats(state),
});

export default connect(
  mapStateToProps,
  {
    prepareWebsocketAndClientId,
    deleteChat,
  },
)(ChatsList);
