import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup, ListGroupItem, Container, Row, Col
} from 'reactstrap';

import AppBar from 'components/AppBar';

class PublicWall extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            {/* <AppBar /> */}
            <ListGroup>
              <ListGroupItem>{'List Item'}</ListGroupItem>
              <ListGroupItem>{'List Item'}</ListGroupItem>
              <ListGroupItem>{'List Item'}</ListGroupItem>
              <ListGroupItem>{'List Item'}</ListGroupItem>
              <ListGroupItem>{'List Item'}</ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PublicWall;
