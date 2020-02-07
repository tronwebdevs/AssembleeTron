import React from 'react';
import StandaloneFormPage from '../../StandaloneFormPage';
import { FormGroup, FormFeedback, Input, Button, Spinner } from 'reactstrap';

import FormCard from '../../FormCard';

const LoginForm = ({
	onSubmit,
	onChange,
	onBlur,
	values,
	errors,
	isSubmitting,
	errorMessage
}) => (
	<StandaloneFormPage>
		<FormCard
			title="Gestione"
			text="Zona riservata"
			onSubmit={onSubmit}
			pAlign="center"
			errorMessage={errorMessage}
		>
			<FormGroup>
				<Input
					type="password"
					placeholder="Password"
					name="password"
					onChange={onChange}
					onBlur={onBlur}
					autoFocus={true}
					value={values.password}
					invalid={errors.password !== undefined}
				/>
				<FormFeedback>{errors.password}</FormFeedback>
			</FormGroup>
			<FormGroup className="mt-1">
				<Button
					type="submit"
					color="primary"
					block={true}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<Spinner color="light" size="sm" />
					) : (
						'Login'
					)}
				</Button>
			</FormGroup>
		</FormCard>
	</StandaloneFormPage>
);

export default LoginForm;
