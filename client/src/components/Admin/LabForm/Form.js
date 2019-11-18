import React from "react";
import PropTypes from "prop-types";
import { Form, Grid, Button, Icon } from "tabler-react";
import LabHour from "./LabHour/";

const CustomForm = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
	handleSubmit,
	handleReset,
	isSubmitting,
	setFieldValue,
	classesLabels
}) => (
	<Form onSubmit={handleSubmit}>
		<Form.Group>
			<Grid.Row className="mb-2">
				<Grid.Col width={12} md={7} className="mb-2 mb-md-0">
					<Form.Input
						placeholder="Generato automaticamente"
						name="_id"
						value={values._id}
						error={errors._id}
						readOnly
						onChange={handleChange}
					/>
				</Grid.Col>
				<Grid.Col width={12} md={5}>
					<Form.Input
						placeholder="Aula"
						name="room"
						value={values.room}
						error={errors.room}
						onChange={handleChange}
					/>
				</Grid.Col>
			</Grid.Row>
            <Grid.Row className="mb-2">
                <Grid.Col width={12}>
					<Form.Input
						placeholder="Titolo"
						name="title"
						value={values.title}
						error={errors.title}
						onChange={handleChange}
					/>
				</Grid.Col>
            </Grid.Row>
			<Grid.Row>
				<Grid.Col width={12}>
					<Form.Textarea
						placeholder="Descrizione"
						rows="4"
						name="description"
						error={errors.description}
						onChange={handleChange}
					>
						{values.description}
					</Form.Textarea>
				</Grid.Col>
			</Grid.Row>
		</Form.Group>
		<Form.Group>
			<Grid.Row>
				{[1, 2].map(h => (
					<LabHour
						key={h}
						h={h}
						classes={classesLabels}
						values={{
							seats: values["seatsH" + h],
							classes: values["classesH" + h]
						}}
						errors={{
							seats: errors["seatsH" + h]
						}}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
					/>
				))}
			</Grid.Row>
		</Form.Group>
		<Form.Group>
			<Grid.Row>
				{[3, 4].map(h => (
					<LabHour
						key={h}
						h={h}
						classes={classesLabels}
						values={{
							seats: values["seatsH" + h],
							classes: values["classesH" + h]
						}}
						errors={{
							seats: errors["seatsH" + h]
						}}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
					/>
				))}
			</Grid.Row>
		</Form.Group>
		<Form.Group>
			<Form.Checkbox
				name="two_h"
				label="Questo laboratorio dura 2 ore"
				checked={values.two_h}
				error={errors.two_h}
				onChange={handleChange}
			/>
		</Form.Group>
		<Form.Group>
			<Grid.Row>
				<Grid.Col width={3} offset={3} className="pr-1">
					<Button
						type="submit"
						block
						color="primary"
						disabled={isSubmitting}
					>
						Salva
					</Button>
				</Grid.Col>
				<Grid.Col width={3} className="pl-1">
					<Button
						type="button"
						onClick={handleReset}
						disabled={isSubmitting}
						block
						color="outline-danger"
					>
						<Icon name="x" />
					</Button>
				</Grid.Col>
			</Grid.Row>
		</Form.Group>
	</Form>
);

CustomForm.propTypes = {
	values: PropTypes.object,
	errors: PropTypes.object,
	touched: PropTypes.object,
	handleChange: PropTypes.func.isRequired,
	handleBlur: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	isSubmitting: PropTypes.bool,
	classesLabels: PropTypes.array
};

export default CustomForm;
