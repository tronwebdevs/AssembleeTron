import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AuthRequired = ({
    component: Component,
    admin,
    ...rest
}) => {
    return (
    <Route
        {...rest}
        render={props => admin.authed ? (
            <Component {...props} />
        ) : (
            <Redirect to={{
                pathname: '/gestore/login',
                state: { from: props.location }
            }} />
        )}
    />
)};

AuthRequired.protoTypes = {
    admin: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	admin: state.admin
});

export default connect(mapStateToProps)(AuthRequired);