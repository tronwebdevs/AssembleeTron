import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Grid, Form } from 'tabler-react';
import moment from 'moment';
import axios from 'axios';
import Selector from './LabForm/LabHour/Selector';

const InfoForm = ({ 
    info,
    authToken,
    setError,
    onSubmit,
    buttons
}) => {
    const [schoolSections, setSchoolSections] = useState([]);

    useEffect(() => {
        async function fetchBackups() {
            const resp = await axios.get('/api/students/sections', {
                headers: { Authorization: `Bearer ${authToken}`}
            });
            const { data, response } = resp;
            if (data && data.code === 1) {
                setSchoolSections(data.sections);
            } else {
                let errorMessage = 'Errore inaspettato';
                if (response && response.data && response.data.message) {
                    errorMessage = response.data.message;
                }
                setError(errorMessage);
            }
        }
        fetchBackups();
      }, [setError, setSchoolSections, authToken]);

    return (
        <Formik
            initialValues={{
                _id: info._id,
                title: info.title,
                date: info.date,
                subOpenTime: moment(info.subscription.open).format('HH:mm'),
                subOpenDate: moment(info.subscription.open).format('YYYY-MM-DD'),
                subCloseTime: moment(info.subscription.close).format('HH:mm'),
                subCloseDate: moment(info.subscription.close).format('YYYY-MM-DD'),
                sections: info.sections.map(c => ({ label: c, value: c }))
            }}
            onSubmit={onSubmit}
            render={({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue
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
                                        name="_id" 
                                        placeholder="Generato automaticamente"
                                        value={values._id} 
                                        error={errors._id} 
                                        touched={touched._id} 
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
                                        value={moment(values.date).format('YYYY-MM-DD')} 
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
                        <Grid.Row>
                            <Grid.Col>
                                <Form.Group label="Classi partecipanti">
                                    <Selector 
                                        name={"sections"} 
                                        value={values.sections} 
                                        classes={schoolSections} 
                                        setValue={value => setFieldValue('sections', value)}
                                        error={errors.sections}
                                    />
                                </Form.Group>
                            </Grid.Col>
                        </Grid.Row>
                        <Grid.Row className="mt-4">
                            {buttons.map((button, index) => (
                                <Grid.Col md={2} className={index === 0 ? "offset-md-4" : null} key={index}>
                                    {button}
                                </Grid.Col>
                            ))}
                        </Grid.Row>
                    </Form>
                )}
        />
    );
};

InfoForm.propTypes = {
    info: PropTypes.object.isRequired,
    authToken: PropTypes.string.isRequired,
    setError: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    buttons: PropTypes.array.isRequired
};

export default InfoForm;