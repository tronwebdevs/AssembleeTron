import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authAdmin } from '../../../actions/adminActions';
import { Formik } from 'formik';

import LoginForm from './LoginForm';

const LoginFormCard = ({ 
    authAdmin
}) => (
    <Formik
        initialValues={{
            password: ""
        }}
        validate={values => {
            let errors = {};
            if (!values.password) {
                errors.password = "Password richiesta"
            }
            return errors;
        }}
        onSubmit={(
            values,
            { setSubmitting, setErrors }
        ) => {
            authAdmin(values.password, (err, data) => {
                setSubmitting(false);
                if (err) {
                    setErrors({ password: err.message });
                } else if(data.code === -1) {
                    setErrors({ password: data.message });
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
    authAdmin: PropTypes.func.isRequired
}

export default connect(() => ({}), { authAdmin })(LoginFormCard);