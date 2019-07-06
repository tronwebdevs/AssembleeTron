import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Grid, Form, Button } from 'tabler-react';
import moment from 'moment';

const InfoForm = ({ info, edit, updateInfo, displayError }) => (
    <Formik
        initialValues={{
            uuid: info.uuid,
            title: info.title || 'Assemblea Senza Nome',
            date: info.date,
            subOpenTime: moment(info.subOpen).format('HH:mm'),
            subOpenDate: moment(info.subOpen).format('YYYY-MM-DD'),
            subCloseTime: moment(info.subClose).format('HH:mm'),
            subCloseDate: moment(info.subClose).format('YYYY-MM-DD')
        }}
        onSubmit={(
            values, 
            { setSubmitting, setErrors }
        ) => {
            updateInfo({
                uuid: values.uuid,
                title: values.title,
                date: values.date,
                subOpen: moment(values.subOpenDate + ' ' + values.subOpenTime).format(),
                subClose: moment(values.subCloseDate + ' ' + values.subCloseTime).format()
            }, (err, info) => {
                setSubmitting(false);
                if (err) {
                    displayError(err.message);
                } else {
                    edit();
                }
            });
        }}
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
                        <Grid.Col md={2} className="offset-md-4">
                            <Button block onClick={() => {
                                edit();
                                displayError('');
                            }} color="outline-danger">Annulla</Button>
                        </Grid.Col>
                        <Grid.Col md={2}>
                            <Button type="submit" block color="primary">Salva</Button>
                        </Grid.Col>
                    </Grid.Row>
                </Form>
            )}
    />
);

InfoForm.propTypes = {
    info: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    updateInfo: PropTypes.func.isRequired
};

export default InfoForm;