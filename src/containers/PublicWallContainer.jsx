import { connect } from 'react-redux';

import { joinWall, leaveWall, checkClientId } from 'actions';
import { getClientId, getPosts, isWallTrackedSelector } from 'reducers';

import PublicWall from 'components/PublicWall';

const mapStateToProps = state => ({
  clientId: getClientId(state),
  posts: getPosts(state),
  isWallTracked: isWallTrackedSelector(state),
});

export default connect(mapStateToProps, {
  joinWall,
  leaveWall,
  checkClientId,
})(PublicWall);
