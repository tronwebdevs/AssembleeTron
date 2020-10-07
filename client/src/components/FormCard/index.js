import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, CardBody, Alert, Form } from 'reactstrap';
import './index.css';

const FormCard = ({
	children,
	onSubmit,
	action,
	method,
	title,
	subtitle,
	text,
	pAlign,
	errorMessage
}) => (
	<Form
		className="card mb-0"
		onSubmit={onSubmit}
		action={action}
		method={method}
	>
		{errorMessage ? (
			<Alert
				color="danger"
				className="text-center"
				fade={false}
				style={{
					borderRadius: '3px 3px 0 0 ',
					margin: '-1px'
				}}
			>
				{errorMessage}
			</Alert>
		) : null}
		<CardBody className="p-6">
			<CardTitle
				style={{ fontSize: '1.3rem' }}
				className="text-center mb-1"
			>
				<b>{title}</b>
			</CardTitle>
			<small className="d-block text-center text-muted mb-3">
				{subtitle}
			</small>
			<p
				className="card-text login-subtitle mb-1"
				style={{ textAlign: pAlign || 'left' }}
			>
				{text}
			</p>
			{children}
		</CardBody>
	</Form>
);

FormCard.propTypes = {
	children: PropTypes.any,
	onSubmit: PropTypes.func,
	action: PropTypes.string,
	method: PropTypes.string,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	text: PropTypes.string,
	pAlign: PropTypes.string,
	errorMessage: PropTypes.string
};

export default FormCard;
