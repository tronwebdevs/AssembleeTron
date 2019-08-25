import React, { useState } from 'react';
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

    const [error, setError] = useState(null);

    const redirectAuthedStudent = labsLength => (
        <Redirect to={{
            pathname: (labsLength === 4 ? '/conferma' : '/iscrizione')
        }} />
    );

    if (student.profile.ID === null) {
        if (assembly.pendings.info === false) {
            if (error) {
                return <LoginCard title={error} />;
            } else if (!assembly.info.date) {
                return <LoginCard title={'Errore inaspettato'} />;
            } else {
                return <LoginFormCard info={assembly.info}/>;
            }
        } else if (assembly.pendings.info === undefined) {
            fetchAssemblyInfo().catch(({ message }) => setError(message));
        }
        return <React.Fragment></React.Fragment>;
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
