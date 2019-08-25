import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyGeneral } from '../../../actions/assemblyActions';
import { Route, Redirect } from 'react-router-dom';

const AuthRequired = ({
    component: Component,
	admin,
	assembly,
	fetchAssemblyGeneral,
    ...rest
}) => {

	if (assembly.pendings.assembly === undefined) {
		fetchAssemblyGeneral();
	}

    return (
		<Route
			{...rest}
			render={props => admin.authed ? (
				<Component {...props} />
			) : (
				<Redirect to={{
					pathname: '/gestore/login',
					state: { 
                        from: props.location, 
                        message: 'Autenticazione richiesta' 
                    }
				}} />
			)}
		/>
	);
};

AuthRequired.protoTypes = {
	admin: PropTypes.object.isRequired,
	assembly: PropTypes.object.isRequired,
	fetchAssemblyGeneral: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	admin: state.admin,
	assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyGeneral })(AuthRequired);