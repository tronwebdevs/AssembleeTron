import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyInfo, fetchLabsAvabile, fetchAllLabs } from '../../../actions/assemblyActions';
import { Redirect } from 'react-router-dom';
import LoginCard from '../../Student/LoginCard/';
import LoginFormCard from '../../Student/LoginForm/LoginFormCard';

class Login extends Component {

    renderAssemblyInfo = (assembly, fetchingProfile) => {
        if (assembly.fetch_pending.info === false) {
            // informazioni gia' ottenute
            if (assembly.error) {
                return <LoginCard title={assembly.error} />;
            } else if (!assembly.info.date) {
                return <LoginCard title={'Errore inaspettato'} />;
            } else {
                return <LoginFormCard info={assembly.info} fetchPending={fetchingProfile} />;
            }
        } else if (assembly.fetch_pending.info === true) {
            // fetching in corso
            return <div></div>;
        } else {
            // nulla fatto
            this.props.fetchAssemblyInfo();
            return <div></div>;
        }
    }

    redirectAuthedStudent = labsCount => {
        if (labsCount === 0) {
            return <Redirect to={{ pathname: '/iscrizione' }} />;
        } else {
            return <Redirect to={{ pathname: '/conferma' }} />;
        }
    }

    render() {
        const { student, assembly } = this.props;

        if (!student.profile.ID) {
            if (student.fetch_pending.profile === false) {
                return this.redirectAuthedStudent(student.labs.length);
            } else if (student.fetch_pending.profile === true) {
                return this.renderAssemblyInfo(assembly, true);
            } else {
                return this.renderAssemblyInfo(assembly, false);
            }
        } else {
            return this.redirectAuthedStudent(student.labs.length);
        }



        
        // this.fetchAssemblyInfo((err, data) => {
        //     if (err) {
        //         return <LoginCard title={error.info} />;
        //     } else if (data.code !== 2) {
        //         return <LoginCard title={error.info} />;
        //     } else {

        //     }
        // });

        // if (!student.profile.ID) {
        //     this.fetc
        // } else {
        //     // redirect to (?)
        // }

        // if (student.fetch_pending.profile === false) {
        //     if (student.labs.length > 0) {
        //         // studente e' iscritto/disiscritto
        //         let notSub = student.labs.every(labID => labID === -1);
        //         if (notSub === true) {
        //             return <Redirect to={{ pathname: '/conferma' }} />;
        //         } else {
        //             if (assembly.fetch_pending.labs !== true && assembly.fetch_pending.labs !== false) {
        //                 this.props.fetchAllLabs();
        //             }
        //             if (assembly.fetch_pending.labs === false) {
        //                 return <Redirect to={{ pathname: '/conferma' }} />;
        //             } else {
        //                 return this.renderCard();
        //             }
        //         }
        //     } else {
        //         // studente non e' ancora iscritto/disiscritto
        //         // fetch avabile labs to student
        //         if (assembly.fetch_pending.avabile_labs !== true && assembly.fetch_pending.avabile_labs !== false) {
        //             this.props.fetchLabsAvabile(student.profile.classLabel);
        //         }
        //         if (assembly.fetch_pending.avabile_labs === false) {
        //             const { from } = this.props.location.state || { from: { pathname: '/iscrizione' } };
        //             return <Redirect to={from} />;
        //         } else {
        //             return this.renderCard();
        //         }
        //     }
        // } else {
        //     return this.renderCard();
        // }
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
