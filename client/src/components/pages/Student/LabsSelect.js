import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Page, Grid, Card } from 'tabler-react';
import Badge from '../../Student/Badge';
import LabsSelectorForm from '../../Student/LabsSelectorForm/';
import LabShow from '../../Student/LabShow';
import ErrorAlert from '../../Student/ErrorAlert';
import SiteWrapper from '../../Student/SiteWrapper';

const LabsSelect = ({
    student,
    assembly
}) => {
    const { profile, labs, labs_avabile } = student;

    if (!profile.ID) {
        return <Redirect to={{ pathname: "/" }} />;
    } else if (labs.length > 0) {
        return <Redirect to={{ pathname: "/conferma" }} />;
    }

    const { error } = assembly;
    let globalError = null;
    const setGlobalError = message => globalError = message;

    return (
        <SiteWrapper>
            <Page.Content title="Laboratori">
                {error ? <ErrorAlert message={error}/> : ''}
                <Grid.Row>
                    <Grid.Col width={12} sm={12} lg={8}>
                        <Card title="Lista dei laboratori" isCollapsible={true} isCollapsed={window.innerWidth < 400} className="w-100">
                            <Card.Body>
                            {labs_avabile.map((lab, index) => <LabShow key={index} title={lab.title} description={lab.description} />)}
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                    <Grid.Col width={12} sm={12} lg={4}>
                        <div style={{ position: 'sticky', top: '1.5rem' }}>
                            <Grid.Row>
                                <Badge student={profile} />
                                <Grid.Col width={12}>
                                    <Card title="Scegli i laboratori">
                                        {globalError ? (
                                            <Card.Alert color="danger">
                                                {globalError}
                                            </Card.Alert>
                                        ) : ''}
                                        <Card.Body>
                                            <u className="d-block mb-4" style={{ fontSize: '0.9em' }}>Per i progetti da <b>due ore</b> seleziona la prima e la seconda ora o la terza e la quarta ora.</u>
                                            <LabsSelectorForm labs={labs_avabile} setGlobalError={setGlobalError} />
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
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps)(LabsSelect);