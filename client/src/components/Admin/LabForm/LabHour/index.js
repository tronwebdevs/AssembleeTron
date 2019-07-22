import React from 'react';
import { Grid, Form } from 'tabler-react';
import Selector from './Selector';

const LabHour = ({
    h,
    classes,
    values,
    errors,
    handleChange,
    setFieldValue
}) => (
    <Grid.Col width={12} md={6}>
        <span className="text-muted">Ora {h}</span>
        <Form.InputGroup className="mb-2">
            <Form.InputGroupPrepend>
                <Form.InputGroupText>Posti: </Form.InputGroupText>
            </Form.InputGroupPrepend>
            <Form.Input type="number" name={"seatsH" + h} value={values.seats} error={errors.seats} onChange={handleChange} />
        </Form.InputGroup>
        <Selector name={"classesH" + h} value={values.classes} classes={classes} setValue={value => setFieldValue('classesH' + h, value)} />
    </Grid.Col>
);

export default LabHour;