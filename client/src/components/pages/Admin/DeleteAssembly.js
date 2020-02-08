import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import {
	deleteAssembly,
	requestBackup
} from '../../../actions/assemblyActions';
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Button,
	ButtonGroup
} from 'reactstrap';
import cogoToast from 'cogo-toast';

const DeleteAssembly = ({ assembly, requestBackup, deleteAssembly }) => {
	const { pendings, info } = assembly;

	if (pendings.delete_assembly === false && info.deleted === true) {
		return <Redirect to={{ pathname: '/gestore/' }} />;
	}

	const backupCompleted = (target, message) => {
		cogoToast.success(message);
		target.className = 'btn btn-success';
		target.innerText = 'Backup completato';
	};
	const backupError = (target, message) => {
		cogoToast.error(message);
		target.disabled = false;
	};

	const handleBackup = e => {
		e.preventDefault();
		let { target } = e;
		target.disabled = true;
		requestBackup()
			.then(msg => backupCompleted(target, msg))
			.catch(({ message }) => backupError(target, message));
	};

	const handleDelete = e => {
		e.preventDefault();
		let { target } = e;
		target.disabled = true;
		deleteAssembly().catch(({ message }) => {
			cogoToast.error(message);
			target.disabled = false;
		});
	};

	return (
		<Fragment>
			<Row>
				<Col xs="12" xl="6">
					<Card>
						<CardHeader>
							<b>Crea backup</b>
						</CardHeader>
						<CardBody>
							<p>
								Prima di eliminare l'assemblea puoi creare un
								backup da utilizzare in un'eventuale assemblea
								futura simile.
							</p>
							<ButtonGroup align="center">
								<Button
									outline
									color="primary"
									onClick={handleBackup}
								>
									Backup
								</Button>
							</ButtonGroup>
						</CardBody>
					</Card>
				</Col>
				<Col xs="12" xl="6">
					<Card>
						<CardHeader>
							<b>Elimina</b>
						</CardHeader>
						<CardBody>
							<p>
								Sicuro di voler eliminare definitivamente
								l'assemblea e tutti i suoi laboratori (questa
								azione e' irreversibile)?
							</p>
							<ButtonGroup align="center">
								<Link
									to="/gestore/"
									className="btn btn-secondary"
								>
									Annulla
								</Link>
								<Button
									outline
									color="danger"
									onClick={handleDelete}
								>
									Si
								</Button>
							</ButtonGroup>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

DeleteAssembly.propTypes = {
	assembly: PropTypes.object.isRequired,
	requestBackup: PropTypes.func.isRequired,
	deleteAssembly: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { deleteAssembly, requestBackup })(
	DeleteAssembly
);
