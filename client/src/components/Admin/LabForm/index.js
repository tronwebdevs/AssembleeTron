import React from "react";
import { connect } from "react-redux";
import {
	updateAssemblyLab,
	createAssemblyLab
} from "../../../actions/assemblyActions";
import PropTypes from "prop-types";
import { Card, CardBody, CardHeader } from "reactstrap";
import { Formik } from "formik";
import Form from "./Form";

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
				message: `Laboratorio "${lab.title}" ${
					action === "edit" ? "modificato" : "creato"
				} con successo`
			});
		}
	};

    const { info, labs } = assembly;
    
    let initialValues = {
        _id: lab._id || "",
        room: lab.room || "",
        title: lab.title || "",
        description: lab.description || "",
        two_h: lab.two_h || false,
    };
    for (let i = 0; i < 4; i++) {
        if (lab.info) {
            initialValues['seatsH' + i] = lab.info[i].seats
            initialValues['classesH' + i] = lab.info[i].sections
        } else {
            initialValues['seatsH' + i] = 0
            initialValues['classesH' + i] = []
        }
    }

    console.log(initialValues)

	return (
		<div id="form-card-wrapper" style={{ boxShadow: "0 0 8px #9E9E9E" }}>
            <Card 
                className="m-0 p-0"
                style={{
                    borderTop: "5px solid",
                    borderTopColor: action === "edit" ? "#f1c40f" : "#5eba00"
                }}
            >
				<CardHeader>
					<b>{action === "edit" ? "Modifica" : "Crea"} laboratorio</b>
				</CardHeader>
				<CardBody>
					<Formik
						enableReinitialize={true}
						initialValues={initialValues}
						validate={values => {
							let errors = {};
							if (values._id !== lab._id) {
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
								errors.description =
									"La descrizione non puo' restare vuota";
                            }
                            
                            for (let i = 0; i < info.tot_h; i++) {
                                if (values['seatsH' + i] > 0 && values['classesH' + i].length <= 0) {
                                    errors['classesH' + i] = 'Devi selezionare almeno una classe partecipante per quest\'ora';
                                }
                                if (values.two_h === true) {
                                    if (i % 2 === 0) {
                                        if (values['seatsH' + i] !== values['seatsH' + (i + 1)]) {
                                            errors['seatsH' + (i + 1)] = 
                                                "Il numero posti di questa ora deve essere " + 
                                                "uguale a quello dell'ora precedente";
                                        }
                                        if (
                                            values['classesH' + i].length !== 0 &&
                                            (
                                                values['classesH' + i].length !== values['classesH' + (i + 1)].length ||
                                                values['classesH' + i]
                                                    .filter(
                                                        sec => values['classesH' + (i + 1)]
                                                            .find(
                                                                ({ value }) => value === sec.value
                                                            ) !== undefined
                                                    ).length === 0
                                            )
                                        ) {
                                            errors['classesH' + (i + 1)] = 
                                                "Le classi partecipati di quest'ora devono essere " + 
                                                "uguali a quelle dell'ora precedente";
                                        }
                                    }
                                }
                            }

							return errors;
						}}
						validateOnChange={false}
						onSubmit={values => {
							let lab = {
								room: (values.room || "").trim(),
								title: (values.title || "").trim(),
								description: (values.description || "").trim(),
								info: [],
								two_h: values.two_h
                            };
                            if (values._id !== "") {
                                lab._id = values._id;
                            }
							for (let i = 0; i < info.tot_h; i++) {
								lab.info.push({
									seats: values['seatsH' + i],
									sections: values['classesH' + i]
								});
                            }
							if (action === "edit") {
								updateAssemblyLab(lab)
									.then(newLab =>
										fetchCallback("edit", newLab, null)
									)
									.catch(err =>
										fetchCallback("edit", null, err)
									);
							} else if (action === "create") {
								createAssemblyLab(lab)
									.then(newLab =>
										fetchCallback("create", newLab, null)
									)
									.catch(err =>
										fetchCallback("create", null, err)
									);
							}
						}}
						onReset={() => {
							handleReset();
							handleCloseModal(false);
						}}
						render={({
							values,
							errors,
							handleChange,
							handleSubmit,
							handleReset,
							isSubmitting,
							setFieldValue
						}) => (
							<Form
								values={values}
								errors={errors}
								handleChange={handleChange}
								handleSubmit={handleSubmit}
								handleReset={handleReset}
								isSubmitting={isSubmitting}
								setFieldValue={setFieldValue}
                                classesLabels={info.sections}
                                tot_h={info.tot_h}
							/>
						)}
					/>
				</CardBody>
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

export default connect(mapStateToProps, {
	updateAssemblyLab,
	createAssemblyLab
})(LabForm);
