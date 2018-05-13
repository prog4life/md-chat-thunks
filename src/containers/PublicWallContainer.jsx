import { connect } from 'react-redux';

import { joinWall, leaveWall, prepareWebsocketAndClientId } from 'actions';
import {
  getClientId, getPosts, isWebsocketOpenSelector, isWallTrackedSelector,
} from 'reducers';

import PublicWall from 'components/PublicWall';

const mapStateToProps = state => ({
  clientId: getClientId(state),
  posts: getPosts(state),
  isWebsocketOpen: isWebsocketOpenSelector(state),
  isWallTracked: isWallTrackedSelector(state),
});

export default connect(mapStateToProps, {
  joinWall,
  leaveWall,
  prepareWebsocketAndClientId,
})(PublicWall);
