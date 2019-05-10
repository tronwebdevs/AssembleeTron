import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

const ErrorAlert = ({ message }) => (
    <Row className="mt-4">
        <Col>
            <Alert variant="danger">{message}</Alert>
        </Col>
    </Row>
);

export default ErrorAlert;