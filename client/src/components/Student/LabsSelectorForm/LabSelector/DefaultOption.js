import React from 'react';
import PropTypes from 'prop-types';

const DefaultOption = ({ h }) => {
	let label;

	switch (h) {
		case 1:
			label = 'Prima';
			break;
		case 2:
			label = 'Seconda';
			break;
		case 3:
			label = 'Terza';
			break;
		case 4:
			label = 'Quarta';
			break;
		case 5:
			label = 'Quinta';
			break;
		case 6:
			label = 'Sesta';
			break;
		case 7:
			label = 'Settima';
			break;
		case 8:
			label = 'Ottava';
			break;
		case 9:
			label = 'Nona';
			break;
		case 10:
			label = 'Decima';
			break;
		case 11:
			label = 'Undicesima';
			break;
		case 12:
			label = 'Dodicesima';
			break;
		default:
			label = '';
			break;
	}
	if (label !== '') {
		label += ' Ora';
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
