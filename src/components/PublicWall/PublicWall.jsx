import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shortId from 'shortid';
import {
  ListGroup, ListGroupItem, Container, Row, Col, Navbar, NavbarBrand,
} from 'reactstrap';

import AppBar from 'components/AppBar';
import AppLogo from 'components/AppLogo';

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
        <Navbar>
          <NavbarBrand href="/">
            <AppLogo />
          </NavbarBrand>
        </Navbar>
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
