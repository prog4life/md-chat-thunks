import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { ListGroup, ListGroupItem } from 'reactstrap';

import Post from './Post';

class PublicWall extends React.Component {
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
    this.joinWallConditionally();
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
      <ListGroup>
        {posts && posts.map((post, index) => {
          return (
            // TODO: replace authorId by post.id
            <ListGroupItem key={shortid.generate()}>
              <Post
                userId={userId}
                {...post}
                onDelete={this.handleDeletePost}
              />
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  }
}

export default PublicWall;
