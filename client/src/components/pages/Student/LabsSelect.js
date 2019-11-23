import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Row, 
    Col,
    Card,
    CardHeader,
    CardBody,
    Alert,
    Button,
    Collapse
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

import { Badge, LabsSelectorForm, LabShow, PageTitle, SiteWrapper } from '../../Student/';

const LabsSelect = ({ student }) => {

    const { profile, labs, labs_avabile } = student;
    
    const [globalError, setGlobalError] = useState(null);
    const [labsCollapse, setLabsCollapse] = useState(window.innerWidth > 999);

    if (profile.studentId === null) {
        return <Redirect to={{ pathname: "/" }} />;
    } else if (labs.length > 0) {
        return <Redirect to={{ pathname: "/conferma" }} />;
    }

    return (
        <SiteWrapper>
            <Row>
                <PageTitle title="Laboratori"/>
            </Row>
            <Row>
                <Col sm="12" lg="8">
                    {window.innerWidth <= 999 ? (
                        <Row>
                            <Badge student={profile} />
                        </Row>
                    ) : null}
                    <Card>
                        <CardHeader onClick={() => setLabsCollapse(!labsCollapse)}>
                            <b>Lista dei laboratori</b>
                            {labsCollapse === false && window.innerWidth <= 999 ? (
                                <small className="text-muted ml-2">(clicca per aprire)</small>
                            ) : null}
                            <Button
                                color="link" 
                                id="labsToggler"
                                style={{
                                    position: 'absolute',
                                    right: '10px'
                                }}
                            >
                                {labsCollapse === true ? (
                                    <FontAwesomeIcon icon={faChevronUp}/>
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown}/>
                                )}
                                
                            </Button>
                        </CardHeader>
                        <Collapse isOpen={labsCollapse}>
                            <CardBody>
                                {labs_avabile.map((lab, index, labs) => (
                                    <LabShow 
                                        key={index} 
                                        title={lab.title} 
                                        description={lab.description} 
                                        borderBottom={index < (labs.length - 1)}
                                    />
                                ))}
                            </CardBody>
                        </Collapse>
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
                                        <Alert color="danger" style={{ borderRadius: '0' }}>
                                            Errore: {globalError}
                                        </Alert>
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
        </SiteWrapper>
    );
};

LabsSelect.propTypes = {
    student: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student
});

export default connect(mapStateToProps)(LabsSelect);