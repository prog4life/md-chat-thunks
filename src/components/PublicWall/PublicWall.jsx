import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

class PublicWall extends React.Component {
  static propTypes = {
    checkClientId: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
    isWallTracked: PropTypes.bool.isRequired,
    joinWall: PropTypes.func.isRequired,
    leaveWall: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  componentDidMount() {
    // prepareWebsocketAndClientId();
    this.joinWallConditionally();
  }

  componentDidUpdate() {
    console.log('PUBLIC WALL UPDATE');

    this.joinWallConditionally();
  }

  componentWillUnmount() {
    const { leaveWall } = this.props;

    leaveWall();
  }

  joinWallConditionally() {
    const { isWallTracked, joinWall, clientId, checkClientId } = this.props;

    // if (!isWallTracked && checkClientId(clientId)) {
    if (!isWallTracked) {
      // joinWall(clientId);
      joinWall();
    }
  }

  render() {
    const { posts } = this.props;

    return (
      <ListGroup>
        {posts.map(({ authorId, nickname, createdAt }, index) => {
          return (
            <ListGroupItem key={authorId}>
              {`List Item ${index + 1}`}
              <div style={{ backgroundColor: 'violet' }}>
                {`Author: ${nickname}`}
              </div>
              <div style={{ backgroundColor: 'lemonchifon' }}>
                {`Created at: ${(new Date(createdAt)).toLocaleString('en-GB')}`}
              </div>
              {' '}
              <Link to={`/chats/${authorId}`}>
                {'Chat'}
              </Link>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  }
}

export default PublicWall;
