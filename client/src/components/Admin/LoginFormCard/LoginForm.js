import React from "react";
import StandaloneFormPage from "../../StandaloneFormPage";
import { FormGroup, Input, Button, Spinner } from "reactstrap";
import TWIcon from "./tw-icon.png";

import FormCard from "../../FormCard";

const LoginForm = ({
	onSubmit,
	onChange,
	onBlur,
	values,
	errors,
	isSubmitting,
	errorMessage
}) => (
	<StandaloneFormPage imageURL={TWIcon}>
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
					error={errors.password}
				/>
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
						"Login"
					)}
				</Button>
			</FormGroup>
		</FormCard>
	</StandaloneFormPage>
);

export default LoginForm;
