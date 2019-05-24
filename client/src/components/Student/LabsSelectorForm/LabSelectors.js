import React from 'react';
import LabSelector from './LabSelector/';

const LabSelectors = ({
    handleChange,
    labs,
    errors,
    values,
}) => {
    return [1, 2, 3, 4].map(h => <LabSelector key={h} labs={labs} h={h} onChange={handleChange} error={errors['h' + h]} value={values['h' + h]} />)
};

export default LabSelectors;