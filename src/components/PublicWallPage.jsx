import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import AppBar from 'components/AppBar';
import PublicWallContainer from 'containers/PublicWallContainer';

const PublicWallPage = () => (
  <Fragment>
    <AppBar />
    <Container>
      <Row>
        <Col>
          <PublicWallContainer />
        </Col>
      </Row>
    </Container>
  </Fragment>
);

export default PublicWallPage;
