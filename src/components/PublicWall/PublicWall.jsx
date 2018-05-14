import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import shortId from 'shortid';

// const posts = [
//   { author: shortId.generate() },
//   { author: shortId.generate() },
//   { author: shortId.generate() },
// ];

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
        {posts.map(({ author }, index) => {
          return (
            <ListGroupItem key={shortId.generate()}>
              {`List Item ${index + 1}`}
              {' '}
              <Link to={`/chats/${author}`}>
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
