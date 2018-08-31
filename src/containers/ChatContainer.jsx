import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Chat from 'components/Chat';

// import {} from 'state/chat';

// import { getMessages } from 'state/selectors';

const mapStateToProps = state => ({
  websocketStatus: state.websocketStatus,
  nickname: state.client.nickname,
  clientId: state.client.id,
  // messages: getMessages(state),
  whoIsTyping: state.whoIsTyping,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    // ...action creators
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
