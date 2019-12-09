import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { authAdmin } from "../../../actions/adminActions";
import { fetchAssemblyGeneral } from "../../../actions/assemblyActions";
import { Redirect } from "react-router-dom";
import { LoginFormCard } from "../../Admin/";

const Login = ({ 
    fetchAssemblyGeneral,
    authAdmin, 
    admin, 
    location 
}) =>
	admin.authed === true && admin.token ? (
		<Redirect
			to={{ pathname: location.state.from.pathname || "/gestore/" }}
		/>
	) : (
		<LoginFormCard
            fetchAssembly={fetchAssemblyGeneral}
			authAdmin={authAdmin}
			errorMessage={location.state ? location.state.message : null}
		/>
	);

Login.protoTypes = {
    fetchAssemblyGeneral: PropTypes.func.isRequired,
	authAdmin: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	location: PropTypes.object
};

const mapStateToProps = state => ({
	admin: state.admin
});

export default connect(mapStateToProps, { fetchAssemblyGeneral, authAdmin })(Login);
