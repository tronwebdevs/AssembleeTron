import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Alert } from 'reactstrap';

const ErrorAlert = ({ message }) => (
    <Row>
        <Col>
            <Alert color="danger">{message}</Alert>
        </Col>
    </Row>
);

ErrorAlert.propTypes = {
    message: PropTypes.string.isRequired
};

export default ErrorAlert;