import React from 'react';
import { Row, Col, Badge } from 'reactstrap';

const StudentBadge = ({ student }) => (
    <Row className="mb-4">
        <Col>
            <Badge color="primary">
                <h5 className="mb-0">{student.name} {student.surname} - {student.classLabel}</h5>
            </Badge>
        </Col>
    </Row>
);

export default StudentBadge;
