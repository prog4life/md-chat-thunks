import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Chat from 'components/Chat';
// TODO: try to import files relative to src/, without .., as src is added
// to modules in webpack's resolve
import {
  prepareWebsocketAndClientId,
  sendMessage,
  sendTyping,
  stopTypingNotification,
  startMonitoring,
  stopMonitoring,
} from 'actions';

import { filterMessages } from 'selectors/messages';

const mapStateToProps = state => ({
  websocketStatus: state.websocketStatus,
  nickname: state.client.nickname,
  clientId: state.client.id,
  messages: filterMessages(state.messages),
  whoIsTyping: state.whoIsTyping,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    prepareWebsocketAndClientId,
    sendMessage,
    sendTyping,
    stopTypingNotification,
    startMonitoring,
    stopMonitoring,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
