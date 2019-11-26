import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import LabForm from "../LabForm/";

Modal.setAppElement("#root");

const LabModal = ({
	showModal,
	handleClose,
	lab,
	action,
	handleReset,
	setLabDisplay,
	setDisplayMessage
}) => (
	<Modal
		key="modal"
		isOpen={showModal}
		contentLabel="Laboratory Modal"
		style={{
			overlay: {
				backgroundColor: "rgba(255, 255, 255, 0.7)"
			},
			content: {
				border: "none",
				maxWidth: "900px",
				width: "100%",
				top: "40px",

				transform: "translateX(-50%)",
				left: "50%",
				right: "auto",

				bottom: "40px",
				background: "transparent",
				borderRadius: "0",
				padding: "0"
			}
		}}
	>
		<LabForm
			lab={lab}
			action={action}
			handleReset={handleReset}
			handleCloseModal={handleClose}
			setDisplayMessage={setDisplayMessage}
			setLabDisplay={setLabDisplay}
		/>
	</Modal>
);

LabModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	lab: PropTypes.object.isRequired,
	action: PropTypes.string.isRequired,
	handleReset: PropTypes.func.isRequired,
	setDisplayMessage: PropTypes.func.isRequired
};

export default LabModal;
