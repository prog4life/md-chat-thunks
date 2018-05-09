import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shortId from 'shortid';
import {
  ListGroup, ListGroupItem, Container, Row, Col,
} from 'reactstrap';

import AppBar from 'components/AppBar';

const posts = [
  { author: shortId.generate() },
  { author: shortId.generate() },
  { author: shortId.generate() },
];

class PublicWall extends React.Component {
  componetDidMount() {}
  render() {
    const { match } = this.props;

    return (
      <Fragment>
        <AppBar />
        <Container>
          <Row>
            <Col>
              {/* <AppBar /> */}
              <ListGroup>
                {posts.map(({ author }, index) => {

                  return (
                    <ListGroupItem key={shortId.generate()}>
                      {`List Item ${index + 1}`}
                      {' '}
                      <Link to={`/chat/${author}`}>
                        {'Chat'}
                      </Link>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default PublicWall;
