import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	createAssemblyInfo,
	loadAssembly
} from '../../../actions/assemblyActions';
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Button,
	Spinner
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { InfoForm, BackupsTable } from '../../Admin/';
import { validateInfoForm } from '../../../utils/';
import moment from 'moment';
import cogoToast from 'cogo-toast';

const CreateAssembly = ({
	admin,
	assembly,
	createAssemblyInfo,
	loadAssembly
}) => {
	const authToken = admin.token;
	const { exists, pendings, info, stats } = assembly;

	const handleSubmit = (values, { setSubmitting, setErrors }) => {
		if (pendings.create_info === undefined) {
			const errors = validateInfoForm(
				values,
				info.sections,
				stats.labs,
				false
			);

			if (Object.entries(errors).length === 0) {
				createAssemblyInfo({
					...values,
					subOpen: moment(
						values.subOpenDate + ' ' + values.subOpenTime
					).format(),
					subClose: moment(
						values.subCloseDate + ' ' + values.subCloseTime
					).format(),
					sections: values.sections.map(({ value }) => value)
				}).catch(({ message }) => {
					setSubmitting(false);
					cogoToast.error(message);
				});
			} else {
				setSubmitting(false);
				setErrors(errors);
			}
		}
	};

	if (
		pendings.create_info === false &&
		exists === true
	) {
		return <Redirect to={{ pathname: '/gestore/laboratori' }} />;
	} else if (exists === true) {
		return <Redirect to={{ pathname: '/gestore/' }} />;
	}

	return (
		<Fragment>
			<Row>
				<Col xs="12">
					<Card>
						<CardHeader>
							<b>Informazioni</b>
						</CardHeader>
						<CardBody>
							<InfoForm
								info={{
									title: '',
									date: moment().startOf('year'),
									subscription: {
										open: moment().startOf('year'),
										close: moment().startOf('year')
									},
									sections: []
								}}
								onSubmit={handleSubmit}
								buttons={[
									<Link
										className="btn btn-block btn-outline-danger"
										to="/gestore/"
									>
										Annulla
									</Link>,
									<Button type="submit" block color="primary">
										Continua
									</Button>
                                ]}
                                labsLength={stats.labs}
								authToken={authToken}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col xs="12">
					<Card>
						<CardHeader>
							<b>Backup</b>
						</CardHeader>
						<BackupsTable
							authToken={authToken}
							button={{
								color: 'gray',
								handleClick: (e, backup) => {
									loadAssembly(
										backup.fileName
									).catch(({ message }) =>
										cogoToast.error(message)
									);
								},
								label:
									pendings.load === true ? (
										<Spinner color="light" size="sm" />
									) : (
										'Carica'
									)
							}}
						/>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

CreateAssembly.propTypes = {
	assembly: PropTypes.object.isRequired,
	admin: PropTypes.object.isRequired,
	createAssemblyInfo: PropTypes.func.isRequired,
	loadAssembly: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly,
	admin: state.admin
});

export default connect(mapStateToProps, { createAssemblyInfo, loadAssembly })(
	CreateAssembly
);
