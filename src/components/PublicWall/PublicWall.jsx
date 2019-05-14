import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { ListGroup, ListGroupItem } from 'reactstrap';

import Post from './Post';

class PublicWall extends React.PureComponent {
  static propTypes = {
    isFetchingPosts: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isSubscribing: PropTypes.bool.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object),
    userId: PropTypes.string,
  }

  static defaultProps = {
    posts: null,
    userId: null,
  };

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
