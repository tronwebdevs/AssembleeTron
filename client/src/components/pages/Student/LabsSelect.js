import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Page, Grid, Card } from 'tabler-react';

import { Badge, LabsSelectorForm, LabShow, SiteWrapper } from '../../Student/';

const LabsSelect = ({ student }) => {

    const { profile, labs, labs_avabile } = student;
    
    const [globalError, setGlobalError] = useState(null);

    if (profile.ID === null) {
        return <Redirect to={{ pathname: "/" }} />;
    } else if (labs.length > 0) {
        return <Redirect to={{ pathname: "/conferma" }} />;
    }

    return (
        <SiteWrapper>
            <Page.Content title="Laboratori">
                <Grid.Row>
                    <Grid.Col width={12} sm={12} lg={8}>
                        {window.innerWidth <= 999 ? (
                            <Grid.Row>
                                <Badge student={profile} />
                            </Grid.Row>
                        ) : null}
                        <Card title="Lista dei laboratori" isCollapsible={true} isCollapsed={window.innerWidth < 400} className="w-100">
                            <Card.Body>
                            {labs_avabile.map((lab, index) => <LabShow key={index} title={lab.title} description={lab.description} />)}
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                    <Grid.Col width={12} sm={12} lg={4}>
                        <div style={{ position: 'sticky', top: '1.5rem' }}>
                            <Grid.Row>
                                {window.innerWidth > 999 ? <Badge student={profile} /> : null}
                                <Grid.Col width={12}>
                                    <Card title="Scegli i laboratori">
                                        {globalError ? (
                                            <Card.Alert color="danger">
                                                Errore: {globalError}
                                            </Card.Alert>
                                        ) : ''}
                                        <Card.Body>
                                            <u className="d-block mb-4" style={{ fontSize: '0.9em' }}>Per i progetti da <b>due ore</b> seleziona la prima e la seconda ora o la terza e la quarta ora.</u>
                                            <LabsSelectorForm labs={labs_avabile} setGlobalError={msg => setGlobalError(msg)}/>
                                        </Card.Body>
                                    </Card>
                                </Grid.Col>
                            </Grid.Row>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
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