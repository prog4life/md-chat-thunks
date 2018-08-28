import { connect } from 'react-redux';

import { signInIfNeeded } from 'state/auth';
import { joinWall, leaveWall, fetchWallId } from 'state/wall';
import { fetchPosts, deletePost } from 'state/posts';
import {
  getUserId, getWallId, getPosts,
  isSubscribedToWall, isSubscribingToWall, isFetchingPosts,
} from 'state/selectors';

import PublicWall from 'components/PublicWall';

const mapStateToProps = state => ({
  userId: getUserId(state),
  wallId: getWallId(state),
  posts: getPosts(state),
  isFetchingPosts: isFetchingPosts(state),
  isSubscribed: isSubscribedToWall(state),
  isSubscribing: isSubscribingToWall(state),
});

export default connect(mapStateToProps, {
  signInIfNeeded,
  joinWall,
  leaveWall,
  fetchWallId,
  deletePost,
  fetchPosts,
})(PublicWall);
