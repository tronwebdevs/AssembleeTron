import React from 'react';

const Option = ({ lab, h }) => (
    <option value={lab.ID} data-twoh={lab.lastsTwoH}>
        {lab.title} - {lab["seatsH" + h]} posti rimanenti
    </option>
);

export default Option;