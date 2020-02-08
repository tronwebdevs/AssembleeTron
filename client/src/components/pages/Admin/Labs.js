import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import {
	deleteAssemblyLab,
    fetchAllLabs,
    createAssemblyLab,
    updateAssemblyLab,
	excludeClassesFromLabs
} from '../../../actions/assemblyActions';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Button, Spinner } from 'reactstrap';
import {
	LabsTutorial,
	LabsTable,
	LabModal,
	LabsCheckModal,
	ExcClassModal,
	PageLoading
} from '../../Admin/';

const Labs = ({
	assembly,
	admin,
	deleteAssemblyLab,
    fetchAllLabs,
    createAssemblyLab,
    updateAssemblyLab,
	excludeClassesFromLabs
}) => {
	const { labs, pendings, info } = assembly;

	const [labDisplay, setLabDisplay] = useState({
		action: 'create',
		lab: {}
	});
	const [showModal, setShowModal] = useState(false);
	const [showCheckModal, setShowCheckModal] = useState(false);
	const [showEscClassModal, setShowEscClassModal] = useState(false);

	if (pendings.labs === undefined && assembly.exists === true) {
		fetchAllLabs();
	}

	if (pendings.assembly === false) {
		return (
			<Fragment>
				<Row>
					<Col xs="12" xl={assembly.exists ? '9' : '12'}>
						<Card>
							{pendings.labs === false ||
							assembly.exists === false ? (
								<LabsTable
									labs={labs}
									setLabDisplay={setLabDisplay}
									deleteAssemblyLab={deleteAssemblyLab}
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
										color="primary"
										outline
										block
										onClick={() =>
											setShowEscClassModal(true)
										}
									>
										Escludi classi
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
					setLabDisplay={setLabDisplay}
				/>
				<LabsCheckModal
					showModal={showCheckModal}
					handleClose={() => setShowCheckModal(false)}
					labs={labs}
					info={info}
				/>
				<ExcClassModal
					tot_h={info.tot_h}
					showModal={showEscClassModal}
					authToken={admin.token}
                    excludeClassesFromLabs={excludeClassesFromLabs}
                    createLab={createAssemblyLab}
                    updateLab={updateAssemblyLab}
                    labs={labs}
					handleClose={() => setShowEscClassModal(false)}
				/>
			</Fragment>
		);
	} else {
		return <PageLoading />;
	}
};

Labs.propTypes = {
	assembly: PropTypes.object.isRequired,
	admin: PropTypes.object.isRequired,
	deleteAssemblyLab: PropTypes.func.isRequired,
    fetchAllLabs: PropTypes.func.isRequired,
    createAssemblyLab: PropTypes.func.isRequired,
    updateAssemblyLab: PropTypes.func.isRequired,
	excludeClassesFromLabs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly,
	admin: state.admin
});

export default connect(mapStateToProps, {
	deleteAssemblyLab,
    fetchAllLabs,
    createAssemblyLab,
    updateAssemblyLab,
	excludeClassesFromLabs
})(Labs);
