import React from "react";
import {
	Col,
	Input,
	InputGroup,
	InputGroupAddon,
    InputGroupText,
    FormFeedback
} from "reactstrap";
import Selector from "./Selector";

const LabHour = ({
	h,
	classes,
	values,
	errors,
	handleChange,
	setFieldValue
}) => (
	<Col xs="12" md="6">
		<span className="text-muted">Ora {h + 1}</span>
		<InputGroup className="mb-2">
			<InputGroupAddon addonType="prepend">
				<InputGroupText>Posti: </InputGroupText>
			</InputGroupAddon>
			<Input
				type="number"
				name={"seats." + h}
				value={values.seats}
				invalid={errors.seats !== undefined}
				onChange={handleChange}
			/>
            <FormFeedback>{errors.seats}</FormFeedback>
		</InputGroup>
		<Selector
			name={"classes" + h}
			value={values.classes}
			classes={classes}
            setValue={value => setFieldValue("classes." + h, value)}
            error={errors.classes}
		/>
	</Col>
);

export default LabHour;
