import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchAssemblyGeneral } from "../../../actions/assemblyActions";
import { Route, Redirect } from "react-router-dom";

const AuthRequired = ({
	component: Component,
	admin,
	assembly,
	fetchAssemblyGeneral,
	...rest
}) => {
    const [error, setError] = useState(null);

    const { pendings, authed, token } = admin;

	if (
		assembly.pendings.assembly === undefined &&
        pendings.auth === false &&
        token !== null
	) {
		fetchAssemblyGeneral().catch(err => err.status !== 401 ? setError(err.message) : null);
	}

	return (
		<Route
			{...rest}
			render={props =>
				authed ? (
					<Component {...props} errorMessage={error} />
				) : (
					<Redirect
						to={{
							pathname: "/gestore/login",
							state: {
								from: props.location,
								message: "Autenticazione richiesta"
							}
						}}
					/>
				)
			}
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
