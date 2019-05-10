import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo, fetchLabsAvabile, fetchAllLabs } from '../../../actions/assemblyActions';
import { Redirect } from 'react-router-dom';

import LoginForm from '../../Student/LoginForm/';
import LoginCard from '../../Student/LoginCard/';

class Login extends Component {
    componentDidMount() {
        this.props.fetchAssemblyInfo();
    }

    renderCard = () => {
        const { info, error } = this.props.assembly;
        const { fetch_pending } = this.props.student;
        if (info.date) {
            return <LoginForm info={info} fetchPending={fetch_pending.profile || false} />;
        } else {
            return <LoginCard title={error.info} />;
        }
    }

    render() {
        const { student, assembly } = this.props;

        if (student.fetch_pending.profile === false) {
            if (student.labs.length > 0) {
                // studente e' iscritto/disiscritto
                let notSub = student.labs.every(labID => labID === -1);
                if (notSub === true) {
                    return <Redirect to={{ pathname: '/conferma' }} />;
                } else {
                    if (assembly.fetch_pending.labs !== true && assembly.fetch_pending.labs !== false) {
                        this.props.fetchAllLabs();
                    }
                    if (assembly.fetch_pending.labs === false) {
                        return <Redirect to={{ pathname: '/conferma' }} />;
                    } else {
                        return (
                            <div className="fake-body">
                                <div className="login-wrapper">
                                    {this.renderCard()}
                                </div>
                            </div>
                        );
                    }
                }
            } else {
                // studente non e' ancora iscritto/disiscritto
                // fetch avabile labs to student
                if (assembly.fetch_pending.avabile_labs !== true && assembly.fetch_pending.avabile_labs !== false) {
                    this.props.fetchLabsAvabile(student.profile.classLabel);
                }
                if (assembly.fetch_pending.avabile_labs === false) {
                    const { from } = this.props.location.state || { from: { pathname: '/iscrizione' } };
                    return <Redirect to={from} />;
                } else {
                    return (
                        <div className="fake-body">
                            <div className="login-wrapper">
                                {this.renderCard()}
                            </div>
                        </div>
                    );
                }
            }
        } else {
            return (
                <div className="fake-body">
                    <div className="login-wrapper">
                        {this.renderCard()}
                    </div>
                </div>
            );
        }
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

export default connect(mapStateToProps, { fetchAssemblyInfo, fetchLabsAvabile, fetchAllLabs })(Login);
