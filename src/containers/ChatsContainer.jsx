import { connect } from 'react-redux';

import Chats from 'Chats';
import { prepareWebsocketAndClientId } from 'actions';

const mapStateToProps = ({ chats }) => ({
  chats
});

export default connect(mapStateToProps, { prepareWebsocketAndClientId })(Chats);
