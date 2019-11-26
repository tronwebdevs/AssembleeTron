import React from "react";
import PropTypes from "prop-types";

const DefaultOption = ({ h }) => {
	let label;

	switch (h) {
		case 1:
			label = "Prima Ora";
			break;
		case 2:
			label = "Seconda Ora";
			break;
		case 3:
			label = "Terza Ora";
			break;
		case 4:
			label = "Quarta Ora";
			break;
		default:
			label = "";
			break;
	}

	return (
		<option value="default" disabled>
			{label}
		</option>
	);
};

DefaultOption.propTypes = {
	h: PropTypes.number.isRequired
};

export default DefaultOption;
