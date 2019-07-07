import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Grid, Form, Button } from 'tabler-react';
import moment from 'moment';

const InfoForm = ({ 
    info,
    onSubmit,
    buttons
}) => (
    <Formik
        initialValues={{
            uuid: info.uuid,
            title: info.title,
            date: info.date,
            subOpenTime: moment(info.subOpen).format('HH:mm'),
            subOpenDate: moment(info.subOpen).format('YYYY-MM-DD'),
            subCloseTime: moment(info.subClose).format('HH:mm'),
            subCloseDate: moment(info.subClose).format('YYYY-MM-DD')
        }}
        onSubmit={onSubmit}
        render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit
        }) => (
                <Form onSubmit={handleSubmit}>
                    <Grid.Row>
                        <Grid.Col width={12} lg={4}>
                            <Form.Group label="Titolo">
                                <Form.Input
                                    name="title" 
                                    value={values.title} 
                                    error={errors.title} 
                                    touched={touched.title} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                    placeholder="Nome assemblea"
                                />
                            </Form.Group>
                            <Form.Group label="Identificativo">
                                <Form.Input 
                                    name="uuid" 
                                    value={values.uuid} 
                                    error={errors.uuid} 
                                    touched={touched.uuid} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    readOnly 
                                />
                            </Form.Group>
                        </Grid.Col>
                        <Grid.Col width={12} lg={4}>
                            <Form.Group label="Data">
                                <Form.Input
                                    type="date" 
                                    name="date" 
                                    value={values.date} 
                                    error={errors.date} 
                                    touched={touched.date} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                    className="mb-2"
                                />
                            </Form.Group>
                        </Grid.Col>
                        <Grid.Col width={12} lg={4}>
                            <Form.Group label="Apertura iscrizioni">
                                <Grid.Row className="mb-2">
                                    <Grid.Col width={12} lg={7}>
                                        <Form.Input 
                                            type="date"
                                            name="subOpenDate"
                                            value={values.subOpenDate} 
                                            touched={touched.subOpenDate} 
                                            error={errors.subOpenDate} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                        />
                                    </Grid.Col>
                                    <Grid.Col width={12} lg={5}>
                                        <Form.Input 
                                            type="time"
                                            name="subOpenTime"
                                            value={values.subOpenTime} 
                                            touched={touched.subOpenTime} 
                                            error={errors.subOpenTime} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                        />
                                    </Grid.Col>
                                </Grid.Row>
                            </Form.Group>
                            <Form.Group label="Chiusura iscrizioni">
                                <Grid.Row className="mb-2">
                                    <Grid.Col width={12} lg={7}>
                                        <Form.Input 
                                            type="date"
                                            name="subCloseDate"
                                            value={values.subCloseDate} 
                                            touched={touched.subCloseDate} 
                                            error={errors.subCloseDate} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                        />
                                    </Grid.Col>
                                    <Grid.Col width={12} lg={5}>
                                        <Form.Input 
                                            type="time"
                                            name="subCloseTime"
                                            value={values.subCloseTime} 
                                            touched={touched.subCloseTime} 
                                            error={errors.subCloseTime} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                        />
                                    </Grid.Col>
                                </Grid.Row>
                            </Form.Group>
                        </Grid.Col>
                    </Grid.Row>
                    <Grid.Row className="mt-4">
                        {buttons.map((button, index) => (
                            <Grid.Col md={2} className={index === 0 ? "offset-md-4" : null}>
                                {button}
                            </Grid.Col>
                        ))}
                    </Grid.Row>
                </Form>
            )}
    />
);

InfoForm.propTypes = {
    info: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    buttons: PropTypes.array.isRequired
};

export default InfoForm;