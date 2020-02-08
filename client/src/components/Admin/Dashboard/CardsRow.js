import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import SmallCard from './SmallCard';

const CardsRow = ({ cards }) => (
	<Row>
		{cards.map((card, index) => (
			<SmallCard key={index} {...card} />
		))}
	</Row>
);

CardsRow.propTypes = {
	cards: PropTypes.array.isRequired
};

export default CardsRow;
