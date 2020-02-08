import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import LabForm from '../LabForm/';

const LabModal = ({
	showModal,
	handleClose,
	lab,
	action,
	handleReset,
	setLabDisplay
}) => (
	<Modal
		isOpen={showModal}
		toggle={handleClose}
		style={{
			maxWidth: 800,
			width: '100%',
			margin: 'auto',
			padding: 5
		}}
	>
		<LabForm
			lab={lab}
			action={action}
			handleReset={handleReset}
			handleCloseModal={handleClose}
			setLabDisplay={setLabDisplay}
		/>
	</Modal>
);

LabModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	lab: PropTypes.object.isRequired,
	action: PropTypes.string.isRequired,
	handleReset: PropTypes.func.isRequired
};

export default LabModal;
