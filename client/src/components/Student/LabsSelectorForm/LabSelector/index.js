import React from 'react';
import { Form } from 'tabler-react';

import DefaultOption from './DefaultOption';
import Option from './Option';

const LabSelector = ({ labs, h, onChange, error, value }) => (
    <Form.Group className="mb-3">
        <Form.Select
            className="select-lab"
            name={'h' + h}
            id={'selectorH' + h}
            onChange={onChange}
            value={value}
            defaultValue="default"
            error={error}
        >
            <DefaultOption h={h} />
            {
                labs.map((lab, index) => {
                    if (lab['seatsH' + h] > 0) {
                        return <Option key={index} lab={lab} h={h} />
                    } else {
                        return '';
                    }
                })
            }
        </Form.Select>
    </Form.Group>
);

export default LabSelector;