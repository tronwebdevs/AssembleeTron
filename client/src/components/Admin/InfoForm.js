import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import {
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	FormFeedback
} from "reactstrap";
import moment from "moment";
import axios from "axios";
import Selector from "./LabForm/LabHour/Selector";

const InfoForm = ({ info, authToken, setError, onSubmit, buttons }) => {
	const [schoolSections, setSchoolSections] = useState([]);

	useEffect(() => {
		async function fetchBackups() {
			const resp = await axios.get("/api/students/sections", {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			const { data, response } = resp;
			if (data && data.code === 1) {
				setSchoolSections(data.sections);
			} else {
				let errorMessage = "Errore inaspettato";
				if (response && response.data && response.data.message) {
					errorMessage = response.data.message;
				}
				setError(errorMessage);
			}
		}
		fetchBackups();
	}, [setError, setSchoolSections, authToken]);

	return (
		<Formik
			initialValues={{
				_id: info._id,
				title: info.title,
				date: info.date,
				subOpenTime: moment(info.subscription.open).format("HH:mm"),
				subOpenDate: moment(info.subscription.open).format(
					"YYYY-MM-DD"
				),
				subCloseTime: moment(info.subscription.close).format("HH:mm"),
				subCloseDate: moment(info.subscription.close).format(
					"YYYY-MM-DD"
				),
				sections: info.sections.map(c => ({ label: c, value: c }))
			}}
			onSubmit={onSubmit}
			render={({
				values,
				errors,
				handleChange,
				handleBlur,
				handleSubmit,
				setFieldValue
			}) => (
				<Form onSubmit={handleSubmit}>
					<Row>
						<Col xs="12" lg="4">
							<FormGroup>
								<Label for="title" className="form-label">
									Titolo
								</Label>
								<Input
									type="text"
									id="title"
									name="title"
									value={values.title}
									invalid={errors.title !== undefined}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Nome assemblea"
								/>
								<FormFeedback>{errors.title}</FormFeedback>
							</FormGroup>
							<FormGroup>
								<Label for="_id" className="form-label">
									Identificativo
								</Label>
								<Input
									type="text"
									name="_id"
									placeholder="Generato automaticamente"
									value={values._id}
									invalid={errors._id !== undefined}
									onChange={handleChange}
									onBlur={handleBlur}
									readOnly
								/>
								<FormFeedback>{errors._id}</FormFeedback>
							</FormGroup>
						</Col>
						<Col xs="12" lg="4">
							<FormGroup>
								<Label for="date" className="form-label">
									Data
								</Label>
								<Input
									type="date"
									name="date"
									id="date"
									value={moment(values.date).format(
										"YYYY-MM-DD"
									)}
									invalid={errors.date !== undefined}
									onChange={handleChange}
									onBlur={handleBlur}
									className="mb-2"
								/>
								<FormFeedback>{errors.date}</FormFeedback>
							</FormGroup>
						</Col>
						<Col xs="12" lg="4">
							<FormGroup>
								<Label className="form-label">
									Apertura iscrizioni
								</Label>
								<Row className="mb-2">
									<Col xs="12" lg="7">
										<Input
											type="date"
											name="subOpenDate"
											id="subOpenDate"
											value={values.subOpenDate}
											invalid={
												errors.subOpenDate !== undefined
											}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<FormFeedback>
											{errors.subOpenDate}
										</FormFeedback>
									</Col>
									<Col xs="12" lg="5">
										<Input
											type="time"
											name="subOpenTime"
											id="subOpenTime"
											value={values.subOpenTime}
											invalid={
												errors.subOpenTime !== undefined
											}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<FormFeedback>
											{errors.subOpenTime}
										</FormFeedback>
									</Col>
								</Row>
							</FormGroup>
							<FormGroup>
								<Label className="form-label">
									Chiusura iscrizioni
								</Label>
								<Row className="mb-2">
									<Col xs="12" lg="7">
										<Input
											type="date"
											name="subCloseDate"
											id="subCloseDate"
											value={values.subCloseDate}
											invalid={
												errors.subCloseDate !==
												undefined
											}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<FormFeedback>
											{errors.subCloseDate}
										</FormFeedback>
									</Col>
									<Col xs="12" lg="5">
										<Input
											type="time"
											name="subCloseTime"
											value={values.subCloseTime}
											invalid={
												errors.subCloseTime !==
												undefined
											}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									</Col>
								</Row>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label for="sections" className="form-label">
									Classi partecipanti
								</Label>
								<Selector
									name={"sections"}
									value={values.sections}
									classes={schoolSections}
									setValue={value =>
										setFieldValue("sections", value)
									}
									error={errors.sections}
								/>
							</FormGroup>
						</Col>
					</Row>
					<Row className="mt-4">
						{buttons.map((button, index) => (
							<Col
								md={{
									size: "2",
									offset: index === 0 ? "4" : null
								}}
								key={index}
							>
								{button}
							</Col>
						))}
					</Row>
				</Form>
			)}
		/>
	);
};

InfoForm.propTypes = {
	info: PropTypes.object.isRequired,
	authToken: PropTypes.string.isRequired,
	setError: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	buttons: PropTypes.array.isRequired
};

export default InfoForm;
