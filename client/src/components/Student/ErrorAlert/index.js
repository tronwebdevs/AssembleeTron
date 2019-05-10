import React from 'react';
import { Row, Col, Alert } from 'reactstrap';

const ErrorAlert = ({ message }) => (
    <Row className="mt-4">
        <Col>
            <Alert color="danger" className="mb-0" >{message}</Alert>
        </Col>
    </Row>
);

export default ErrorAlert;