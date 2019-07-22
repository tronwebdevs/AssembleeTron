import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo } from '../../../actions/assemblyActions';
import { Redirect } from 'react-router-dom';

import { LoginCard, LoginFormCard } from '../../Student/';

const Home = ({
    student,
    assembly,
    fetchAssemblyInfo
}) => {

    const redirectAuthedStudent = labsCount => (
        <Redirect to={{
            pathname: (labsCount === 0 ? '/iscrizione' : '/conferma')
        }} />
    );

    if (!student.profile.ID) {
        if (student.fetch_pending.profile === false) {
            return redirectAuthedStudent(student.labs.length);
        } else {
            if (assembly.pendings.info === false) {
                if (assembly.error) {
                    return <LoginCard title={assembly.error} />;
                } else if (!assembly.info.date) {
                    return <LoginCard title={'Errore inaspettato'} />;
                } else {
                    return <LoginFormCard info={assembly.info}/>;
                }
            } else if (assembly.pendings.info === undefined) {
                fetchAssemblyInfo();
            }
            return <React.Fragment></React.Fragment>;
        }
    } else {
        return redirectAuthedStudent(student.labs.length);
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
