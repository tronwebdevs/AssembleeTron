import React from 'react';
import { connect } from 'react-redux';
import {
	updateAssemblyLab,
	createAssemblyLab
} from '../../../actions/assemblyActions';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Formik } from 'formik';
import cogoToast from 'cogo-toast';
import Form from './Form';
import { validateLabForm } from '../../../utils/';

const LabForm = ({
	lab,
	action,
	handleReset,
	handleCloseModal,
	setLabDisplay,
	updateAssemblyLab,
	createAssemblyLab,
	assembly
}) => {
	const fetchCallback = (action, lab, err) => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		handleCloseModal(false);
		setLabDisplay({
			action: 'create',
			lab: {}
		});
		if (err) {
			cogoToast.error(err.message);
		} else {
			cogoToast.success(
				`Laboratorio "${lab.title}" ${
					action === 'edit' ? 'modificato' : 'creato'
				} con successo`
			);
		}
	};

	const { info, labs } = assembly;

	let initialValues = {
		_id: lab._id || '',
		room: lab.room || '',
		title: lab.title || '',
		description: lab.description || '',
		two_h: lab.two_h || false
	};
	for (let i = 0; i < info.tot_h; i++) {
		if (lab.info) {
			initialValues['seatsH' + i] = lab.info[i].seats;
			initialValues['classesH' + i] = lab.info[i].sections;
		} else {
			initialValues['seatsH' + i] = 0;
			initialValues['classesH' + i] = [];
		}
	}

	return (
		<div id="form-card-wrapper" class="tw-modal">
			<Card
				className="m-0 p-0"
				style={{
					borderTop: '5px solid',
					borderTopColor: action === 'edit' ? '#f1c40f' : '#5eba00'
				}}
			>
				<CardHeader>
					<b>{action === 'edit' ? 'Modifica' : 'Crea'} laboratorio</b>
				</CardHeader>
				<CardBody>
					<Formik
						enableReinitialize={true}
						initialValues={initialValues}
						validate={values => validateLabForm(values, lab, labs, info)}
						validateOnChange={false}
						onSubmit={values => {
							let lab = {
								room: (values.room || '').trim(),
								title: (values.title || '').trim(),
								description: (values.description || '').trim(),
								info: [],
								two_h: values.two_h
							};
							if (values._id !== '') {
								lab._id = values._id;
							}
							for (let i = 0; i < info.tot_h; i++) {
								lab.info.push({
									seats: values['seatsH' + i],
									sections: (
                                        values['seatsH' + i] > 0 ? 
                                        values['classesH' + i] :
                                        []
                                    )
								});
							}
							if (action === 'edit') {
								updateAssemblyLab(lab)
									.then(newLab =>
										fetchCallback('edit', newLab, null)
									)
									.catch(err =>
										fetchCallback('edit', null, err)
									);
							} else if (action === 'create') {
								createAssemblyLab(lab)
									.then(newLab =>
										fetchCallback('create', newLab, null)
									)
									.catch(err =>
										fetchCallback('create', null, err)
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
