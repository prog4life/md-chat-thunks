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
    joinWall: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  }
  componentDidMount() {
    const { joinWall } = this.props;
  }
  componentWillUnmount() {
    const { leaveTheWall } = this.props;
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
