import React from "react";
import PropTypes from "prop-types";
import { Row, Col, UncontrolledAlert } from "reactstrap";

const AdminAlert = ({ display, message, type }) =>
	display === true ? (
		<Row>
			<Col xs="12">
				<UncontrolledAlert color={type || "danger"}>
					{message}
				</UncontrolledAlert>
			</Col>
		</Row>
	) : null;

AdminAlert.propTypes = {
	display: PropTypes.bool.isRequired,
	message: PropTypes.string,
	type: PropTypes.string
};

export default AdminAlert;
