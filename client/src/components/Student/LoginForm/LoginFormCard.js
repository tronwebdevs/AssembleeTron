import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authStudent } from '../../../actions/studentActions';
import { fetchAssemblyInfo } from '../../../actions/assemblyActions';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import LoginForm from './LoginForm';

const LoginFormCard = ({ fetchPending, student, ...props }) => (
    <Formik
        initialValues={{
            studentID: "",
            part: "1"
        }}
        validate={values => {
            let errors = {};
            if (!values.studentID) {
                errors.studentID = "Matricola richiesta"
            } else if (isNaN(values.studentID)) {
                errors.studentID = "Questa non e' una matricola"
            } else if (!values.part) {
                errors.part = "Partecipi?"
            }
            return errors;
        }}
        onSubmit={(
            values,
            { setSubmitting, setErrors }
        ) => {
            props.authStudent(+values.studentID, +values.part, (err, data) => {
                setSubmitting(false);
                if (err) {
                    setErrors({ studentID: err.message });
                } else if(data.code === -1) {
                    setErrors({ studentID: data.message });
                } else {
                    if (student.labs.lenght === 0) {
                        return <Redirect to={{ pathname: '/laboratori' }} />;
                    } else {
                        return <Redirect to={{ pathname: '/conferma' }} />;
                    }
                }
            });
        }}
        render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
        }) => (
            <LoginForm
                onSubmit={handleSubmit}
                onChange={handleChange}
                onBlur={handleBlur}
                values={values}
                errors={errors}
                touched={touched}
                fetchPending={fetchPending}
            />
        )}
    />
);

LoginFormCard.propTypes = {
    authStudent: PropTypes.func.isRequired,
    fetchAssemblyInfo: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
    fetchPending: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
	student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { authStudent, fetchAssemblyInfo })(LoginFormCard);