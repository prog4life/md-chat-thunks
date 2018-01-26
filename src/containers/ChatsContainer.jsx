import { connect } from 'react-redux';

import Chats from 'Chats';

const mapStateToProps = ({ chats }) => ({
  chats
});

export default connect(mapStateToProps)(Chats);
