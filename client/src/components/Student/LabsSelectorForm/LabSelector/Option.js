import React from 'react';
import PropTypes from 'prop-types';

const Option = ({ lab, h }) => (
    <option value={lab.ID} data-twoh={lab.lastsTwoH}>
        {lab.title} - {lab["seatsH" + h]} posti rimanenti
    </option>
);

Option.propTypes = {
    lab: PropTypes.object.isRequired,
    h: PropTypes.number.isRequired
};

export default Option;