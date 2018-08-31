import { connect } from 'react-redux';

import { getUserId } from 'state/selectors';
// import Chats from 'components/Chats';
import ChatsList from 'components/ChatsList';

const mapStateToProps = state => ({
  userId: getUserId(state),
});

export default connect(mapStateToProps)(ChatsList);
