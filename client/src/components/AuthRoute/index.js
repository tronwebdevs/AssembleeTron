import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authentication from './Authentication';

function AuthRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={
                props => Authentication.isAuthed ? <Component {...props} /> : <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            }
        />
    );
}

export default AuthRoute;