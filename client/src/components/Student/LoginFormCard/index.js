import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authStudent } from '../../../actions/studentActions';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';

import LoginForm from './LoginForm';

const LoginFormCard = ({ 
    student, 
    authStudent 
}) => (
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
                errors.part = "Partecipi?" // not displayed
            }
            return errors;
        }}
        onSubmit={(
            values,
            { setSubmitting, setErrors }
        ) => {
            authStudent(+values.studentID, +values.part, (err, data) => {
                setSubmitting(false);
                if (err) {
                    setErrors({ studentID: err.message });
                } else if(data.code === -1) {
                    setErrors({ studentID: data.message });
                } else {
                    let pathname = '/conferma';
                    if (student.labs.lenght === 0) {
                        pathname = '/laboratori';
                    }
                    return <Redirect to={{ pathname }} />;
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
                isSubmitting={isSubmitting}
            />
        )}
    />
);

LoginFormCard.propTypes = {
    authStudent: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { authStudent })(LoginFormCard);