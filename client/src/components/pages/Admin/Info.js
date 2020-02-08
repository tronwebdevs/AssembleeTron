import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { updateAssemblyInfo } from '../../../actions/assemblyActions';
import { InfoForm, PageLoading } from '../../Admin/';
import moment from 'moment';
import { validateInfoForm } from '../../../utils/';
import cogoToast from 'cogo-toast';

const Info = ({ assembly, admin, updateAssemblyInfo }) => {
	const { pendings, info, stats } = assembly;

	const [edit, setEdit] = useState(false);

	const handleSubmit = (values, { setSubmitting, setErrors }) => {
		if (pendings.update_info !== true) {
			const errors = validateInfoForm(
				values,
				info.sections,
				stats.labs,
				true
			);
			if (Object.entries(errors).length === 0) {
				updateAssemblyInfo({
					...values,
					subOpen: moment(
						values.subOpenDate + ' ' + values.subOpenTime
					).format(),
					subClose: moment(
						values.subCloseDate + ' ' + values.subCloseTime
					).format(),
					sections: values.sections.map(({ value }) => value)
				})
					.then(message => {
						setEdit(false);
						setSubmitting(false);
						cogoToast.success(message);
					})
					.catch(({ message }) => {
						setEdit(false);
						setSubmitting(false);
						cogoToast.error(message);
					});
			} else {
				setSubmitting(false);
				setErrors(errors);
			}
		}
	};

	if (pendings.assembly === false || pendings.info === false) {
		return (
			<Fragment>
				<Row>
					<Col xs="12">
						<Card>
							<CardBody>
								{assembly.exists === true ? (
									<InfoForm
										info={info}
										onSubmit={handleSubmit}
										buttons={
											edit === true
												? [
														<Button
															type="reset"
															block
															onClick={() => {
																setEdit(false);
															}}
															outline
															color="danger"
														>
															Annulla
														</Button>,
														<Button
															type="submit"
															block
															color="primary"
															disabled={
																pendings.info ===
																true
															}
														>
															Salva
														</Button>
												  ]
												: [
														<Button
															block
															color="primary"
															onClick={() =>
																setEdit(true)
															}
														>
															Modifica
														</Button>
												  ]
										}
										setError={message =>
											cogoToast.error(message)
										}
										authToken={admin.token}
										formDisabled={!edit}
									/>
								) : (
									<p>
										Devi creare un'assemblea prima di poter
										visualizzare le informazioni
									</p>
								)}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Fragment>
		);
	} else {
		return <PageLoading />;
	}
};

Info.propTypes = {
	assembly: PropTypes.object.isRequired,
	admin: PropTypes.object.isRequired,
	updateAssemblyInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly,
	admin: state.admin
});

export default connect(mapStateToProps, { updateAssemblyInfo })(Info);
