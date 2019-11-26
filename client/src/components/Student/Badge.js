import React from "react";
import PropTypes from "prop-types";
import { Col, Card } from "reactstrap";

const StudentBadge = ({ student, ...rest }) => (
	<Col xs="12" {...rest}>
		<Card className="text-center bg-primary text-white">
			<h4 className="my-4">
				{student.name} {student.surname} - {student.section}
			</h4>
		</Card>
	</Col>
);

StudentBadge.propTypes = {
	student: PropTypes.object.isRequired
};

export default StudentBadge;
