import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import LoginFormCard from '../../Admin/LoginFormCard/';

const Login = ({ admin, location }) => (
    admin.authed ? (
        <Redirect to={{ pathname: location.state.from.pathname || '/gestore/' }} />
    ) : (
        <LoginFormCard />
    )
);

Login.protoTypes = {
    admin: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	admin: state.admin
});


export default connect(mapStateToProps)(Login);