import React from "react";
import StandaloneFormPage from "../../StandaloneFormPage";
import {
	Spinner,
	Button,
	FormGroup,
	Input,
	CustomInput,
	FormFeedback
} from "reactstrap";
import moment from "moment";

import FormCard from "../../FormCard";
import StudentIdHelp from "./StudentIdHelp";

const LoginForm = ({
	onSubmit,
	onChange,
	onBlur,
	values,
	errors,
	isSubmitting,
	assemblyInfo
}) => (
	<StandaloneFormPage>
		<FormCard
			title={`Iscrizioni per l'${assemblyInfo.title}`}
            subtitle={moment(assemblyInfo.date).format("DD/MM/YYYY")}
			text={true ? "Inserisci la tua matricola per entrare:" : ""}
			onSubmit={onSubmit}
		>
			{/* <Form.Group>
                <Card.Alert color="primary">
                    <Grid.Row>
                        <Grid.Col width={8}>
                            Sei gia' loggato come:
                            <br />
                            <b>Nome Cognome</b>
                        </Grid.Col>
                        <Grid.Col width={4}>
                            <span className="float-right">
                                <Button color="outline-primary">
                                    <Icon name="log-out" />
                                </Button>
                            </span>
                        </Grid.Col>
                    </Grid.Row>
                </Card.Alert>
            </Form.Group> */}
			<FormGroup className="mb-1">
				<Input
					type="text"
					placeholder="Matricola"
					name="studentID"
					onChange={onChange}
					onBlur={onBlur}
					autoFocus={true}
					value={values.studentID}
					invalid={errors.studentID !== undefined}
				/>
				<FormFeedback>{errors.studentID}</FormFeedback>
			</FormGroup>
			<span className="text-center">
				<FormGroup className="mb-1">
					<CustomInput
						type="radio"
						id="partRadio"
						label="Partecipo"
						name="part"
						value="1"
						checked={values.part === "1"}
						onChange={onChange}
						onBlur={onBlur}
						inline
					/>
					<CustomInput
						type="radio"
						id="noPartRadio"
						label="Non partecipo"
						name="part"
						value="0"
						onChange={onChange}
						onBlur={onBlur}
						checked={values.part === "0"}
						inline
					/>
				</FormGroup>
			</span>
			{errors.part ? (
				<div className="input-feedback text-danger">{errors.part}</div>
			) : null}
			<FormGroup className="pt-2">
				<Button
					type="submit"
					color="primary"
					block={true}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<Spinner color="light" size="sm" />
					) : (
						"Entra"
					)}
				</Button>
			</FormGroup>
		</FormCard>
        <StudentIdHelp />
	</StandaloneFormPage>
);

export default LoginForm;
