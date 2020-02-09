import React from 'react';
import PropTypes from 'prop-types';
import {
	Row,
	Col,
	Form,
	FormGroup,
	FormFeedback,
	Input,
	CustomInput,
	Button
} from 'reactstrap';
import LabHour from './LabHour/';

const CustomForm = ({
	values,
	errors,
	handleChange,
	handleSubmit,
	handleReset,
	isSubmitting,
	setFieldValue,
	classesLabels,
	tot_h
}) => (
	<Form onSubmit={handleSubmit}>
		<FormGroup>
			<Row className="mb-2">
				<Col xs="12" md="7" className="mb-2 mb-md-0">
					<Input
						type="text"
						placeholder="Generato automaticamente"
						name="_id"
						value={values._id}
						invalid={errors._id !== undefined}
						readOnly
						onChange={handleChange}
					/>
					<FormFeedback>{errors._id}</FormFeedback>
				</Col>
				<Col xs="12" md="5">
					<Input
						type="text"
						placeholder="Aula"
						name="room"
						value={values.room}
						invalid={errors.room !== undefined}
						onChange={handleChange}
					/>
					<FormFeedback>{errors.room}</FormFeedback>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col xs="12">
					<Input
						type="text"
						placeholder="Titolo"
						name="title"
						value={values.title}
						invalid={errors.title !== undefined}
						onChange={handleChange}
					/>
					<FormFeedback>{errors.title}</FormFeedback>
				</Col>
			</Row>
			<Row>
				<Col xs="12">
					<Input
						type="textarea"
						placeholder="Descrizione"
						rows="4"
						name="description"
						value={values.description}
						invalid={errors.description !== undefined}
						onChange={handleChange}
					/>
					<FormFeedback>{errors.description}</FormFeedback>
				</Col>
			</Row>
		</FormGroup>
		<FormGroup>
			<Row>
				{[...Array(tot_h).keys()].map(i => (
					<LabHour
						key={i}
						h={i}
						classes={classesLabels}
						values={{
							seats: values['seatsH' + i],
							classes: values['classesH' + i]
						}}
						errors={{
							seats: errors['seatsH' + i],
							classes: errors['classesH' + i]
						}}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
					/>
				))}
			</Row>
		</FormGroup>
		<FormGroup>
			<CustomInput
				type="checkbox"
				name="two_h"
				id="two_h"
				label="Questo laboratorio dura 2 ore"
				checked={values.two_h}
				invalid={errors.two_h}
				onChange={handleChange}
			/>
			<FormFeedback>{errors.two_h}</FormFeedback>
		</FormGroup>
		<FormGroup className="mb-0">
			<Row>
				<Col xs="6" md={{ size: '3', offset: '3' }} className="pr-1">
					<Button
						type="submit"
						block
						color="primary"
						disabled={isSubmitting}
					>
						Salva
					</Button>
				</Col>
				<Col xs="6" md="3" className="pl-1">
					<Button
						type="button"
						onClick={handleReset}
						disabled={isSubmitting}
						block
						outline
						color="danger"
					>
						Annulla
					</Button>
				</Col>
			</Row>
		</FormGroup>
	</Form>
);

CustomForm.propTypes = {
	values: PropTypes.object,
	errors: PropTypes.object,
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	isSubmitting: PropTypes.bool,
	classesLabels: PropTypes.array,
	tot_h: PropTypes.number
};

export default CustomForm;
