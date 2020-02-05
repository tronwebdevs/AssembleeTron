import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LoginCard, LoginFormCard } from "../../Student/";

const Home = ({ student, assembly, errorMessage }) => {
    const { pendings, info } = assembly;

    const redirectAuthedStudent = labs => (
        <Redirect
            to={{
                pathname: labs === null ? "/iscrizione" : "/conferma"
            }}
        />
    );

    if (student.profile.studentId === null) {
        if (pendings.info === false) {
            if (errorMessage) {
                if (assembly.exists === true) {
                    return <LoginCard title={info.title} text={errorMessage} />;
                } else {
                    return <LoginCard title={errorMessage} />;
                }
            } else {
                return <LoginFormCard info={info} />;
            }
        } else {
            return <Fragment></Fragment>;
        }
    } else {
        return redirectAuthedStudent(student.labs);
    }
};

Home.propTypes = {
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
    errorMessage: PropTypes.string
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps)(Home);
