import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authAdmin } from '../../../actions/adminActions';
import { Redirect } from 'react-router-dom';
import { Formik } from 'formik';
import { LoginPage } from 'tabler-react';

const Login = ({
    admin,
    authAdmin
}) => {

    if (admin.id !== -1) {
        return <Redirect to={{ pathname: '/gestore/' }} />;
    }

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
            }}
            validate={values => {
                let errors = {};
                if (!values.email) {
                    errors.email = 'Questo campo non puo\' essere vuoto';
                } else if (!values.password) {
                    errors.password = 'Questo campo non puo\' essere vuoto';
                }
                return errors;
            }}
            onSubmit={(
                values,
                { setSubmitting, setErrors }
            ) => {
                authAdmin(values.email, values.password, (err, data) => {
                    setSubmitting(false);
                    if (err) {
                        setErrors(err.message);
                    } else if (data.code === -1) {
                        setErrors(data.message);
                    } else {
                        return <Redirect to={{ pathname: '/gestore/' }} />;
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
                <LoginPage
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values}
                    errors={errors}
                    touched={touched}
                    strings={{
                        title: "Login gestore",
                        buttonText: "Login",
                        emailLabel: "Username",
                        emailPlaceholder: "Username",
                    }}
                />
            )}
        />
    )
};

Login.propTypes = {
    authAdmin: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    admin: state.admin
})

export default connect(mapStateToProps, { authAdmin })(Login);