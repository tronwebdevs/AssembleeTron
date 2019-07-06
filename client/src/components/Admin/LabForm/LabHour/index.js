import React from 'react';
import { Form } from 'tabler-react';
import Selector from './Selector';

const LabHour = ({
    h,
    classes,
    values,
    errors,
    handleChange,
    setFieldValue
}) => (
    <Form.Group label={"Ora " + h}>
        <Form.InputGroup className="mb-2">
            <Form.InputGroupPrepend>
                <Form.InputGroupText>Posti: </Form.InputGroupText>
            </Form.InputGroupPrepend>
            <Form.Input type="number" name={"seatsH" + h} value={values.seats} error={errors.seats} onChange={handleChange} />
        </Form.InputGroup>
        <Selector name={"classesH" + h} value={values.classes} classes={classes} setValue={value => setFieldValue('classesH' + h, value)} />
    </Form.Group>
);

export default LabHour;