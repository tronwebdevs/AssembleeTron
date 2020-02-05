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
        case 5:
            label = "Quinta Ora";
            break;
        case 6:
            label = "Sesta Ora";
            break;
        case 7:
			label = "Settima Ora";
            break;
        case 8:
			label = "Ottava Ora";
            break;
        case 9:
			label = "Nona Ora";
            break;
        case 10:
			label = "Decima Ora";
            break;
        case 11:
			label = "Undicesima Ora";
            break;
        case 12:
			label = "Dodicesima Ora";
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
