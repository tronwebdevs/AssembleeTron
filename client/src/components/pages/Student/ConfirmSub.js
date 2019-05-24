import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LabsTable from '../../Student/LabsTable';
import Badge from '../../Student/Badge';
import { Page, Grid } from 'tabler-react';
import SiteWrapper from '../../Student/SiteWrapper';
import NotPartCard from '../../Student/NotPartCard/';
import moment from 'moment';

class ConfirmSub extends Component {

    state = { 
        notSub: this.props.student.labs.every(labID => labID === -1) 
    };

    render() {

        const { profile, labs } = this.props.student;

        if (!profile.ID) {
            return <Redirect to={{ pathname: "/" }} />;
        } else if (labs.length === 0) {
            return <Redirect to={{ pathname: "/iscrizione" }} />;
        }

        const { assembly } = this.props;
        const { date } = assembly.info;

        return (
            <SiteWrapper>
                <Page.Content title={"Iscrizioni per l'Assemblea d'Istituto del " + moment(date).format('DD/MM/YYYY')}>
                    <Grid.Row>
                        <Badge student={profile} sm={12} lg={4} offsetLg={4} />
                    </Grid.Row>
                    {this.state.notSub ? <NotPartCard/> : <LabsTable labs={labs} />}
                </Page.Content>
            </SiteWrapper>
        );
    }
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
