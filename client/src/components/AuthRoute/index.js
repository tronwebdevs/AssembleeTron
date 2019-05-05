import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            rest.student.profile.ID ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: "/",
                    state: {
                        from: props.location
                    }
                }} />
            )
        )}
    />
);

const mapStateToProps = state => ({
    student: state.student
});

export default connect(mapStateToProps)(AuthRoute);