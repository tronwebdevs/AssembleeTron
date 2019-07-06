import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Button, Icon } from 'tabler-react';
import LabHour from './LabHour/';

const CustomForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
    setFieldValue
}) => {

    const classes = [
        '1CACLAS',
        '1CBCLAS',
        '1IA',
        '1IB',
        '1IC',
        '1ID',
        '1LALING',
        '1LBLING',
        '1LC',
        '1LCLING',
        '1PA',
        '1PB',
        '1SA',
        '1SB',
        '2CACLAS',
        '2CBCLAS',
        '2IA',
        '2IB',
        '2IC',
        '2ID',
        '2LALING',
        '2LBLING',
        '2LC',
        '2LCLING',
        '2ME',
        '2PA',
        '2SA',
        '2SB',
        '3CACLAS',
        '3CBLBCL/LIN',
        '3IA',
        '3IB',
        '3IC',
        '3ID',
        '3LALING',
        '3LC',
        '3LCLING',
        '3ME',
        '3PA',
        '3SA',
        '3SB',
        '4CACLAS',
        '4IA',
        '4IB',
        '4IC',
        '4ID',
        '4LALING',
        '4LBLING',
        '4LC',
        '4LCLING',
        '4LDLING',
        '4ME',
        '4PA',
        '4SA',
        '4SB',
        '5CALCCL/LIN',
        '5CBCLAS',
        '5IA',
        '5IB',
        '5IC',
        '5IF',
        '5LALING',
        '5LBLING',
        '5LC',
        '5LDLING',
        '5MD',
        '5ME',
        '5SA',
        '5SB',
    ];
    return (
    <Form onSubmit={handleSubmit}>
        <Form.Group>
            <Grid.Row className="mb-2">
                <Grid.Col width={12} md={3}>
                    <Form.Input type="number" name="ID" value={values.ID} error={errors.ID} readOnly onChange={handleChange} />
                </Grid.Col>
                <Grid.Col width={12} md={9}>
                    <Form.Input placeholder="Aula" name="room" value={values.room} error={errors.room} onChange={handleChange} />
                </Grid.Col>
            </Grid.Row>
            <Grid.Row className="mb-2">
                <Grid.Col width={12}>
                    <Form.Input placeholder="Titolo" name="title" value={values.title} error={errors.title} onChange={handleChange} />
                </Grid.Col>
            </Grid.Row>
            <Grid.Row>
                <Grid.Col width={12}>
                    <Form.Textarea placeholder="Descrizione" rows="4" name="description" error={errors.description} onChange={handleChange}>{values.description}</Form.Textarea>
                </Grid.Col>
            </Grid.Row>
        </Form.Group>
        {[1, 2, 3, 4].map(h => (
            <LabHour
                key={h}
                h={h}
                classes={classes}
                values={{
                    seats: values['seatsH' + h],
                    classes: values['classesH' + h],
                }}
                errors={{
                    seats: errors['seatsH' + h]
                }}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
            />
        ))}
        <Form.Group>
            <Form.Checkbox name="lastsTwoH" label="Questo laboratorio dura 2 ore" value={values.lastsTwoH} error={errors.lastsTwoH} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
            <Grid.Row>
                <Grid.Col width={12} lg={10} className="pr-1">
                    <Button type="submit" block color="primary">Salva</Button>
                </Grid.Col>
                <Grid.Col width={12} lg={2} className="pl-1">
                    <Button type="button" onClick={handleReset} block color="outline-danger">
                        <Icon name="x" />
                    </Button>
                </Grid.Col>
            </Grid.Row>
        </Form.Group>
    </Form>
);};

CustomForm.propTypes = {
    values: PropTypes.array,
    errors: PropTypes.array,
    touched: PropTypes.array,
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool
};

export default CustomForm;