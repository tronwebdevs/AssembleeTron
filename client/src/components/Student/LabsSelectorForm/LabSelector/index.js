import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'tabler-react';

import DefaultOption from './DefaultOption';
import Option from './Option';

const LabSelector = ({
    labs,
    h, 
    onChange, 
    value,
    error 
}) => (
    <Form.Group className="mb-3">
        <Form.Select
            className="select-lab"
            name={'h' + h}
            id={'selectorH' + h}
            onChange={onChange}
            value={value}
            error={error}
        >
            <DefaultOption h={h} />
            {
                labs.map((lab, index) => {
                    if (lab.info['h' + h].seats > 0) {
                        return <Option key={index} lab={lab} h={h} />
                    } else {
                        return '';
                    }
                })
            }
        </Form.Select>
    </Form.Group>
);

LabSelector.propTypes = {
    labs: PropTypes.array.isRequired,
    h: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired, 
    value: PropTypes.string.isRequired,
    error: PropTypes.string
};

export default LabSelector;