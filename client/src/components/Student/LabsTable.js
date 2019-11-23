import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody } from 'reactstrap';
import InfoBox from './InfoBox';

const LabsTable = ({ labs }) => (
    <>
        <Row>
            <Col>
                <Card>
                    <CardBody>
                        <Row>
                            {labs.map((lab, index) => (
                                <div className={"col-12 " + (index !== 3 ? "mb-3 border-bottom" : "")} key={index}>
                                    <Row>
                                        <Col xs="3" className="py-2 pr-0">
                                            <span className="text-muted d-block text-center">Ora {index + 1}:</span>
                                        </Col>
                                        <Col xs="9" className="py-2 pl-0">
                                            <Row>
                                                <Col xs="12">
                                                    <span className="d-block">{lab.title}</span>
                                                </Col>
                                                <Col xs="12">
                                                    <span className="d-block text-muted">Aula: {lab.room}</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <InfoBox />
    </>
);

LabsTable.propTypes = {
    labs: PropTypes.array.isRequired
};

export default LabsTable;