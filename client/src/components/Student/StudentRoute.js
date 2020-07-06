import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo } from '../../actions/assemblyActions';
import { logout } from '../../actions/studentActions';
import { Route } from 'react-router-dom';
import moment from 'moment';

const StudentRoute = ({
	component: Component,
    assembly,
    student,
    logout,
    fetchAssemblyInfo,
	...rest
}) => {
    const [error, setError] = useState(null);
    const { pendings, info } = assembly;
    const { profile } = student;

	if (pendings.info === undefined) {
		fetchAssemblyInfo().catch(err => setError(err.message));
	} if (
        pendings.info === false &&
        profile.studentId !== null &&
        (info.date === undefined || moment(info.date).diff(moment()) < 0)
    ) {
        logout();
    }

	return (
		<Route
            {...rest}
            render={props => <Component {...props} errorMessage={error} />}
		/>
	);
};

StudentRoute.protoTypes = {
    assembly: PropTypes.object.isRequired,
    student: PropTypes.object.isRequired,
    fetchAssemblyInfo: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly,
    student: state.student,
});

export default connect(mapStateToProps, { fetchAssemblyInfo, logout })(StudentRoute);
