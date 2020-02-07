import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authStudent } from '../../../actions/studentActions';
import { Formik } from 'formik';

import LoginForm from './LoginForm';

const LoginFormCard = ({ authStudent, info }) => (
	<Formik
		initialValues={{
			studentID: '',
			part: '1'
		}}
		validate={values => {
			let errors = {};
			if (!values.studentID) {
				errors.studentID = 'Matricola richiesta';
			} else if (isNaN(values.studentID)) {
				errors.studentID = "Questa non e' una matricola";
			} else if (!values.part) {
				errors.part = 'Partecipi?'; // not displayed
			}
			return errors;
		}}
		onSubmit={(values, { setSubmitting, setErrors }) =>
			authStudent(+values.studentID, +values.part)
				.then(() => setSubmitting(false))
				.catch(({ message, target }) => {
					setSubmitting(false);
					setErrors({ [target || 'studentID']: message });
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
				assemblyInfo={info}
			/>
		)}
	/>
);

LoginFormCard.propTypes = {
	authStudent: PropTypes.func.isRequired
};

export default connect(() => ({}), { authStudent })(LoginFormCard);
