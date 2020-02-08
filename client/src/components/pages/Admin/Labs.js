import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import {
	deleteAssemblyLab,
	fetchAllLabs
} from '../../../actions/assemblyActions';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Button, Spinner } from 'reactstrap';
import {
	LabsTutorial,
	LabsTable,
	LabModal,
	LabsCheckModal,
	PageLoading,
	AdminAlert
} from '../../Admin/';

const Labs = ({ assembly, deleteAssemblyLab, fetchAllLabs }) => {
	const { labs, pendings, info } = assembly;

	const [displayMessage, setDisplayMessage] = useState({
		type: null,
		message: null
	});
	const [labDisplay, setLabDisplay] = useState({
		action: 'create',
		lab: {}
	});
	const [showModal, setShowModal] = useState(false);
	const [showCheckModal, setShowCheckModal] = useState(false);

	if (pendings.labs === undefined && assembly.exists === true) {
		fetchAllLabs();
	}

	if (pendings.assembly === false) {
		return (
			<Fragment>
				<AdminAlert
					display={displayMessage.message !== null}
					message={displayMessage.message}
					type={displayMessage.type}
				/>
				<Row>
					<Col xs="12" xl={assembly.exists ? '9' : '12'}>
						<Card>
							{pendings.labs === false ||
							assembly.exists === false ? (
								<LabsTable
									labs={labs}
									setLabDisplay={setLabDisplay}
									deleteAssemblyLab={deleteAssemblyLab}
									setDisplayMessage={setDisplayMessage}
									setShowModal={setShowModal}
								/>
							) : (
								<div className="py-5 text-center">
									<Spinner
										color="secondary"
										style={{
											width: '3rem',
											height: '3rem'
										}}
									/>
								</div>
							)}
						</Card>
					</Col>
					{assembly.exists === true ? (
						<Col xs="12" xl="3">
							<Card>
								<CardBody>
									<Button
										type="button"
										color="success"
										block
										onClick={() => setShowModal(true)}
									>
										Crea
									</Button>
									<Button
										color="info"
										outline
										block
										onClick={() => setShowCheckModal(true)}
									>
										Controlla
									</Button>
								</CardBody>
							</Card>
							<LabsTutorial />
						</Col>
					) : null}
				</Row>
				<LabModal
					showModal={showModal}
					handleClose={() => setShowModal(false)}
					lab={labDisplay.lab}
					action={labDisplay.action}
					handleReset={() =>
						setLabDisplay({ action: 'create', lab: {} })
					}
					setDisplayMessage={setDisplayMessage}
					setLabDisplay={setLabDisplay}
				/>
				<LabsCheckModal
					showModal={showCheckModal}
					handleClose={() => setShowCheckModal(false)}
					labs={labs}
					info={info}
				/>
			</Fragment>
		);
	} else {
		return <PageLoading />;
	}
};

Labs.propTypes = {
	assembly: PropTypes.object.isRequired,
	deleteAssemblyLab: PropTypes.func.isRequired,
	fetchAllLabs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { deleteAssemblyLab, fetchAllLabs })(
	Labs
);
