import React from 'react'
import { Row, Col } from 'react-bootstrap';

export default function LabComponent(props) {
    const { title, description } = props.lab;
    return (
        <div className="col-12 mb-3 border-bottom">
            <Row>
                <Col sm={4}>
                    <span className="font-weight-bold lab-row-student">{title}</span>
                </Col>
                <Col sm={6}>
                    <p className="text-left mb-2 lab-row-student">{description}</p>
                </Col>
            </Row>
        </div>
    )
}
