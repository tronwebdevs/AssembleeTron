import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Page, Grid } from 'tabler-react';
import { LabsTable, Badge, SiteWrapper, NotPartCard } from '../../Student/';
import moment from 'moment';

const ConfirmSub = ({
    student,
    assembly
}) => {

    const { profile, labs } = student;

    if (profile.ID === null) {
        return <Redirect to={{ pathname: "/" }} />;
    } else if (labs.length === 0) {
        return <Redirect to={{ pathname: "/iscrizione" }} />;
    }

    const { date } = assembly.info;
    const notSub = labs.every(labID => labID === -1);

    return (
        <SiteWrapper>
            <Page.Content title={"Iscrizioni per l'Assemblea d'Istituto del " + moment(date).format('DD/MM/YYYY')}>
                <Grid.Row>
                    <Badge student={profile} sm={12} lg={4} offsetLg={4} />
                </Grid.Row>
                {notSub ? <NotPartCard/> : <LabsTable labs={labs} />}
            </Page.Content>
        </SiteWrapper>
    );
}

ConfirmSub.propTypes = {
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps)(ConfirmSub);
