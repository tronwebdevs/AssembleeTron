import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
    Container, 
    Row, 
    Col,
    Card,
    CardHeader,
    CardText,
    CardBody
} from 'reactstrap';

import { Badge, LabsSelectorForm, LabShow } from '../../Student/';

const LabsSelect = ({ student }) => {

    const { profile, labs, labs_avabile } = student;
    
    const [globalError, setGlobalError] = useState(null);

    if (profile.studentId === null) {
        return <Redirect to={{ pathname: "/" }} />;
    } else if (labs.length > 0) {
        return <Redirect to={{ pathname: "/conferma" }} />;
    }

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    <h1 className="display-3 py-3">Laboratori</h1>
                </Col>
            </Row>
            <Row>
                <Col sm="12" lg="8">
                    {window.innerWidth <= 999 ? (
                        <Row>
                            <Badge student={profile} />
                        </Row>
                    ) : null}
                    <Card>
                        <CardHeader>
                            <b>Lista dei laboratori</b>
                        </CardHeader>
                        <CardBody>
                            <CardText>
                            {labs_avabile.map((lab, index) => <LabShow key={index} title={lab.title} description={lab.description} />)}
                            </CardText>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="12" lg="4">
                    <div style={{ position: 'sticky', top: '1.5rem' }}>
                        <Row>
                            {window.innerWidth > 999 ? <Badge student={profile} /> : null}
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <b>Scegli i laboratori</b>
                                    </CardHeader>
                                    {globalError ? (
                                        <Card.Alert color="danger">
                                            Errore: {globalError}
                                        </Card.Alert>
                                    ) : ''}
                                    <CardBody>
                                        <u className="d-block mb-4" style={{ fontSize: '0.9em' }}>Per i progetti da <b>due ore</b> seleziona la prima e la seconda ora o la terza e la quarta ora.</u>
                                        <LabsSelectorForm labs={labs_avabile} setGlobalError={msg => setGlobalError(msg)}/>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

LabsSelect.propTypes = {
    student: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student
});

export default connect(mapStateToProps)(LabsSelect);