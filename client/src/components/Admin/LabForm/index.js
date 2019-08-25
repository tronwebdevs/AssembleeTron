import React from "react";
import { connect } from "react-redux";
import {
	updateAssemblyLab,
	createAssemblyLab
} from "../../../actions/assemblyActions";
import PropTypes from "prop-types";
import { Formik } from "formik";
import Form from "./Form";
import { Card } from "tabler-react";

const LabForm = ({
	id,
	lab,
	action,
	handleReset,
	handleCloseModal,
	setDisplayMessage,
	setLabDisplay,
	updateAssemblyLab,
	createAssemblyLab,
	assembly
}) => {
	const fetchCallback = (action, lab, err) => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
		handleCloseModal(false);
		setLabDisplay({
			action: "create",
			lab: {}
		});
		if (err) {
			setDisplayMessage({
				type: "danger",
				message: err.message
			});
		} else {
			setDisplayMessage({
				type: "success",
				message: `Laboratorio ${lab.ID} ${
					action === "edit" ? "modificato" : "creato"
				} con successo`
			});
		}
	};

	return (
		<div id="form-card-wrapper">
			<Card className="m-0 p-0">
				<Card.Body>
					<Card.Title>
						{action === "edit" ? "Modifica" : "Crea"} laboratorio
					</Card.Title>
					<Formik
						enableReinitialize={true}
						initialValues={{
							ID: lab.ID || id,
							room: lab.room || "",
							title: lab.title || "",
							description: lab.description || "",
							seatsH1: lab.seatsH1 || 0,
							classesH1: (lab.classesH1 || []).map(cl => ({
								label: cl,
								value: cl
							})),
							seatsH2: lab.seatsH2 || 0,
							classesH2: (lab.classesH2 || []).map(cl => ({
								label: cl,
								value: cl
							})),
							seatsH3: lab.seatsH3 || 0,
							classesH3: (lab.classesH3 || []).map(cl => ({
								label: cl,
								value: cl
							})),
							seatsH4: lab.seatsH4 || 0,
							classesH4: (lab.classesH4 || []).map(cl => ({
								label: cl,
								value: cl
							})),
							lastsTwoH: lab.lastsTwoH
						}}
						validate={values => {
							let errors = {};
							if (values.ID !== lab.ID) {
								const { labs } = assembly;
								labs.forEach(lab => {
									if (lab.ID === values.ID) {
										errors.ID = "ID duplicato";
									}
									if (lab.room === values.room.trim()) {
										errors.room = `Classe identica al laboratorio ${
											lab.ID
										}`;
									}
									if (lab.title === values.title.trim()) {
										errors.title = `Esiste gia' un laboratorio con questo titolo (${
											lab.ID
										})`;
									}
									if (
										lab.description ===
											values.description.trim() &&
										values.description !== "-"
									) {
										errors.description = "Classe duplicato";
									}
								});
							}
							if (values.title.trim() === "") {
								errors.title =
									"Il titolo non puo' restare vuoto";
							}
							if (values.room.trim() === "") {
								errors.room = "L'aula non puo' restare vuota";
							}
							if (values.description.trim() === "") {
								errors.description =
									"La descrizione non puo' restare vuota";
							}

							return errors;
						}}
						validateOnChange={false}
						onSubmit={values => {
							let lab = {
								ID: values.ID,
								room: values.room,
								title: values.title,
								description: values.description || "",
								seatsH1: values.seatsH1 || 0,
								classesH1: (values.classesH1 || []).map(
									({ label }) => label
								),
								seatsH2: values.seatsH2 || 0,
								classesH2: (values.classesH2 || []).map(
									({ label }) => label
								),
								seatsH3: values.seatsH3 || 0,
								classesH3: (values.classesH3 || []).map(
									({ label }) => label
								),
								seatsH4: values.seatsH4 || 0,
								classesH4: (values.classesH4 || []).map(
									({ label }) => label
								),
								lastsTwoH: values.lastsTwoH
							};
							if (action === "edit") {
                                updateAssemblyLab(lab)
                                    .then(newLab => fetchCallback("edit", newLab, null))
                                    .catch(err => fetchCallback("edit", null, err));
							} else if (action === "create") {
                                createAssemblyLab(lab)
                                    .then(newLab => fetchCallback("create", newLab, null))
                                    .catch(err => fetchCallback("create", null, err));
							}
						}}
						onReset={() => {
							handleReset();
							handleCloseModal(false);
						}}
						render={({
							values,
							errors,
							touched,
							handleChange,
							handleBlur,
							handleSubmit,
							handleReset,
							isSubmitting,
							setFieldValue
						}) => (
							<Form
								values={values}
								errors={errors}
								touched={touched}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleSubmit={handleSubmit}
								handleReset={handleReset}
								isSubmitting={isSubmitting}
								setFieldValue={setFieldValue}
								classesLabels={
                                    assembly.students
									.filter(
										(std, pos, arr) =>
											arr.findIndex(s => s.classLabel === std.classLabel) === pos
									)
									.map(std => std.classLabel)
                                    .sort()
                                }
							/>
						)}
					/>
				</Card.Body>
			</Card>
		</div>
	);
};

LabForm.propTypes = {
	id: PropTypes.number.isRequired,
	lab: PropTypes.object.isRequired,
	action: PropTypes.string.isRequired,
	handleReset: PropTypes.func.isRequired,
	handleCloseModal: PropTypes.func.isRequired,
	setDisplayMessage: PropTypes.func.isRequired,
	setLabDisplay: PropTypes.func.isRequired,
	updateAssemblyLab: PropTypes.func.isRequired,
	createAssemblyLab: PropTypes.func.isRequired,
	assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { updateAssemblyLab, createAssemblyLab })(LabForm);
