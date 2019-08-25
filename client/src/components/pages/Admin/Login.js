import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authAdmin } from '../../../actions/adminActions';
import { Redirect } from 'react-router-dom';

import LoginFormCard from '../../Admin/LoginFormCard/';

const Login = ({ 
    authAdmin,
    admin, 
    location
}) => admin.authed ? (
    <Redirect to={{ pathname: location.state.from.pathname || '/gestore/' }} />
) : (
    <LoginFormCard authAdmin={authAdmin} errorMessage={location.state ? location.state.message : null}/>
);

Login.protoTypes = {
    authAdmin: PropTypes.func.isRequired,
	admin: PropTypes.object.isRequired,
	location: PropTypes.object
};

const mapStateToProps = state => ({
	admin: state.admin
});

export default connect(mapStateToProps, { authAdmin })(Login);