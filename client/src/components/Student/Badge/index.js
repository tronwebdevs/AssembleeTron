import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';

const StudentBadge = ({ student }) => (
    <Row className="mb-4">
        <Col>
            <Badge variant="primary">{student.name} {student.surname} - {student.classLabel}</Badge>
        </Col>
    </Row>
);

export default StudentBadge;
