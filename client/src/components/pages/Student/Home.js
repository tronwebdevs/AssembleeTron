import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo } from '../../../actions/assemblyActions';
import { Redirect } from 'react-router-dom';

import LoginCard from '../../Student/LoginCard/';
import LoginFormCard from '../../Student/LoginFormCard/';

class Home extends Component {

    renderAssemblyInfo = assembly => {
        if (assembly.fetch_pending.info === false) {
            if (assembly.error) {
                return <LoginCard title={assembly.error} />;
            } else if (!assembly.info.date) {
                return <LoginCard title={'Errore inaspettato'} />;
            } else {
                return <LoginFormCard info={assembly.info}/>;
            }
        } else if (assembly.fetch_pending.info === true) {
            return <></>;
        } else {
            this.props.fetchAssemblyInfo();
            return <></>;
        }
    }

    redirectAuthedStudent = labsCount => {
        let pathname = '/conferma';
        if (labsCount === 0) {
            pathname = '/iscrizione';
        }
        return <Redirect to={{ pathname }} />;
    }

    render() {
        const { student, assembly } = this.props;

        if (!student.profile.ID) {
            if (student.fetch_pending.profile === false) {
                return this.redirectAuthedStudent(student.labs.length);
            } else {
                return this.renderAssemblyInfo(assembly);
            }
        } else {
            return this.redirectAuthedStudent(student.labs.length);
        }
    }
}

Home.propTypes = {
    fetchAssemblyInfo: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyInfo })(Home);
