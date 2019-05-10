import React from 'react';
import { Col, Form } from 'react-bootstrap';

import Label from './Label';
import Option from './Option';

const LabSelector = ({ labs, h }) => (
    <Col sm={6} className="my-md-1">
        <Form.Group className="mb-2">
            <Form.Control as="select" className="select-lab" name={'h' + h}>
                <option value="default" defaultChecked={true} disabled>
                    <Label h={h} />
                </option>
                {labs.map((lab, index) => <Option key={index} lab={lab} h={h} />)}
            </Form.Control>
            <Form.Control.Feedback className="text-left" id={'if-h' + h}></Form.Control.Feedback>
        </Form.Group>
    </Col>
);

export default LabSelector;