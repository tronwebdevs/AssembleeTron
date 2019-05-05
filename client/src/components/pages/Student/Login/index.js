import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo } from '../../../../actions/assemblyActions';
import { Redirect } from 'react-router-dom';

import LoginComponent from './LoginComponent';
import AssemblyClose from './AssemblyClose';

class Login extends Component {
    componentDidMount() {
        this.props.fetchAssemblyInfo();
    }

    renderLogin = () => {
        const { info, error } = this.props.assembly;
        if (info) {
            return <LoginComponent info={info} />;
        } else {
            return <AssemblyClose message={error.info} />
        }
    }

    render() {
        if (this.props.student.profile.ID) {
            const { from } = this.props.location.state || { from: { pathname: '/iscrizione' } };
            //TODO: check if student is alredy sub/wants unsub
            return <Redirect to={from} />;
        }

        return (
            <div className="fake-body">
                <div className="login-wrapper">
                    {this.renderLogin()}
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    fetchAssemblyInfo: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyInfo })(Login);