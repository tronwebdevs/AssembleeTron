import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";

const LabShow = ({ title, description, borderBottom }) => (
	<div
		className={
			"col-12 " + (borderBottom === true ? "mb-3 border-bottom" : "")
		}
	>
		<Row>
			<Col sm={5}>
				<span className="font-weight-bold lab-row-student">
					{title}
				</span>
			</Col>
			<Col sm={7}>
				<p className="text-left mb-2 lab-row-student">{description}</p>
			</Col>
		</Row>
	</div>
);

LabShow.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	borderBottom: PropTypes.bool.isRequired
};

export default LabShow;
