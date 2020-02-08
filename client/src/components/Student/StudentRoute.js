import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo } from '../../actions/assemblyActions';
import { Route } from 'react-router-dom';

const AuthRequired = ({
	component: Component,
	assembly,
	fetchAssemblyInfo,
	...rest
}) => {
	const [error, setError] = useState(null);

	if (assembly.pendings.info === undefined) {
		fetchAssemblyInfo().catch(err => setError(err.message));
	}

	return (
		<Route
			{...rest}
			render={props => <Component {...props} errorMessage={error} />}
		/>
	);
};

AuthRequired.protoTypes = {
	assembly: PropTypes.object.isRequired,
	fetchAssemblyInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyInfo })(AuthRequired);
