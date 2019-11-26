import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import LoginForm from "./LoginForm";

const LoginFormCard = ({ authAdmin, errorMessage }) => (
	<Formik
		initialValues={{
			password: ""
		}}
		validate={values => {
			let errors = {};
			if (!values.password) {
				errors.password = "Password richiesta";
			}
			return errors;
		}}
		onSubmit={(values, { setSubmitting, setErrors }) =>
			authAdmin(values.password)
				.then(() => setSubmitting(false))
				.catch(({ message }) => {
					setSubmitting(false);
					setErrors({ password: message });
				})
		}
		render={({
			values,
			errors,
			touched,
			handleChange,
			handleBlur,
			handleSubmit,
			isSubmitting
		}) => (
			<LoginForm
				onSubmit={handleSubmit}
				onChange={handleChange}
				onBlur={handleBlur}
				values={values}
				errors={errors}
				touched={touched}
				isSubmitting={isSubmitting}
				errorMessage={errorMessage}
			/>
		)}
	/>
);

LoginFormCard.propTypes = {
	authAdmin: PropTypes.func.isRequired,
	errorMessage: PropTypes.string
};

export default LoginFormCard;
