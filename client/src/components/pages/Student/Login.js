import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo } from '../../../actions/assemblyActions';
import { Redirect } from 'react-router-dom';

import LoginForm from '../../Student/LoginForm/';
import LoginCard from '../../Student/LoginCard/';

class Login extends Component {
    componentDidMount() {
        this.props.fetchAssemblyInfo();
    }

    renderCard = () => {
        const { info, error } = this.props.assembly;
        if (info.date) {
            return <LoginForm info={info} />;
        } else {
            return <LoginCard title={error.info} />;
        }
    }

    render() {
        const { authed } = this.props.student;

        if (authed === true) {
            //TODO: check if student is alredy sub/wants unsub
            return <Redirect to={{ pathname: '/iscrizione' }} />;
        }

        return (
            <div className="fake-body">
                <div className="login-wrapper">
                    {this.renderCard()}
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