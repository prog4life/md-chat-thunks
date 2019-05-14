import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signInIfNeeded, maybeLogin } from 'state/auth';
import { joinWall, leaveWall, fetchWallId } from 'state/wall';
import { fetchPosts, deletePost } from 'state/posts';
import {
  getUserId, getWallId, getPosts,
  isSubscribedToWall, isSubscribingToWall, isFetchingPosts,
} from 'state/selectors';

import PublicWall from 'components/PublicWall';

class PublicWallContainer extends Component {
  static propTypes = {
    // checkClientId: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    fetchPosts: PropTypes.func.isRequired,
    fetchWallId: PropTypes.func.isRequired,
    isFetchingPosts: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isSubscribing: PropTypes.bool.isRequired,
    joinWall: PropTypes.func.isRequired,
    leaveWall: PropTypes.func.isRequired,
    maybeLogin: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object),
    signInIfNeeded: PropTypes.func.isRequired,
    userId: PropTypes.string,
    wallId: PropTypes.string,
  }

  static defaultProps = {
    posts: null,
    userId: null,
    wallId: null,
  };

  componentDidMount() {
    // prepareWebsocketAndClientId();
    // this.login();
    this.joinWallConditionally();
  }

  componentDidUpdate() {
    console.log('PUBLIC WALL UPDATE');
    // this.login();
    // this.joinWallConditionally();
  }

  componentWillUnmount() {
    const { userId, wallId, leaveWall } = this.props;

    leaveWall(userId, wallId);
  }

  login() {
    const { maybeLogin } = this.props;
    maybeLogin();
  }

  joinWallConditionally() {
    const { isWallTracked, joinWall, userId, checkClientId } = this.props;

    // if (!isWallTracked && checkClientId(userId)) {
    if (!isWallTracked) {
      // joinWall(userId);
      joinWall();
    }
  }

  render() {
    const {
      posts, userId, isSubscribing, isSubscribed, isFetchingPosts,
    } = this.props;

    return (
      <PublicWall
        {...{
          posts,
          userId,
          isSubscribing,
          isSubscribed,
          isFetchingPosts,
        }}
      />
    );
  }
}

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
  maybeLogin,
  joinWall,
  leaveWall,
  fetchWallId,
  deletePost,
  fetchPosts,
})(PublicWallContainer);
