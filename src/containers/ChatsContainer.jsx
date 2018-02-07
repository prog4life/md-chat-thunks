import { connect } from 'react-redux';

import Chats from 'Chats';
import { prepareWebsocketAndClientId, deleteChat } from 'actions';

const mapStateToProps = ({ clientId, chats }) => ({
  clientId,
  chats
});

export default connect(
  mapStateToProps,
  {
    prepareWebsocketAndClientId,
    deleteChat
  }
)(Chats);
