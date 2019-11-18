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
import SectionsList from '../../../utils/SectionsList';

const LabForm = ({
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
    
    const completeSectionsList = assembly.info.sections;

	return (
		<div id="form-card-wrapper" style={{ boxShadow: "0 0 8px #9E9E9E" }}>
			<Card className="m-0 p-0">
				<Card.Body>
					<Card.Title>
						{action === "edit" ? "Modifica" : "Crea"} laboratorio
					</Card.Title>
					<Formik
						enableReinitialize={true}
						initialValues={{
							_id: lab._id || "",
							room: lab.room || "",
							title: lab.title || "",
							description: lab.description || "",
							seatsH1: lab.info ? lab.info.h1.seats : 0,
							classesH1: (lab.info ? SectionsList.parse(lab.info.h1.sections, completeSectionsList).getList() : []).map(cl => ({
								label: cl,
								value: cl
							})),
							seatsH2: lab.info ? lab.info.h2.seats : 0,
							classesH2: (lab.info ? SectionsList.parse(lab.info.h2.sections, completeSectionsList).getList() : []).map(cl => ({
								label: cl,
								value: cl
							})),
							seatsH3: lab.info ? lab.info.h3.seats : 0,
							classesH3: (lab.info ? SectionsList.parse(lab.info.h3.sections, completeSectionsList).getList() : []).map(cl => ({
								label: cl,
								value: cl
							})),
							seatsH4: lab.info ? lab.info.h4.seats : 0,
							classesH4: (lab.info ? SectionsList.parse(lab.info.h4.sections, completeSectionsList).getList() : []).map(cl => ({
								label: cl,
								value: cl
							})),
							two_h: lab.two_h
						}}
						validate={values => {
							let errors = {};
							if (values._id !== lab._id) {
								const { labs } = assembly;
								labs.forEach(lab => {
									if (lab._id === values._id) {
										errors._id = "ID duplicato";
									}
									if (lab.room === values.room.trim()) {
										errors.room = `Aula identica al laboratorio "${lab.title}"`;
									}
									if (lab.title === values.title.trim()) {
										errors.title = `Esiste gia' un laboratorio con questo titolo ("${lab.title}")`;
									}
									if (
										lab.description ===
											values.description.trim() &&
										values.description !== "-"
									) {
										errors.description = `Esiste gia' un laboratorio con questa descrizione ("${lab.title}")`;
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
								errors.description = "La descrizione non puo' restare vuota";
							}

							return errors;
						}}
						validateOnChange={false}
						onSubmit={values => {
							let lab = {
								_id: values._id,
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
								two_h: values.two_h
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
											arr.findIndex(s => s.section === std.section) === pos
									)
									.map(std => std.section)
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
