import React from 'react';
import { Form, Button } from 'tabler-react';
import { Formik } from 'formik';
import LabSelectors from './LabSelectors';

const LabsSelectorForm = ({ labs }) => (
    <Formik
        initialValues={{
            h1: 'default',
            h2: 'default',
            h3: 'default',
            h4: 'default'
        }}
        validate={values => {
            let errors = {};
            for (let i = 1; i <= 4; i++) {
                if (!values['h' + i] || values['h' + i] === 'default') {
                    errors['h' + i] = 'Scegli un laboratorio per quest\'ora';
                }
            }
            return errors;
        }}
        onSubmit={(
            values,
            { setSubmitting, setErrors }
        ) => {
            alert('Done.');
        }}
        render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
        }) => (
            <Form onSubmit={handleSubmit} className="pt-2">
                <LabSelectors
                    handleChange={handleChange}
                    labs={labs}
                    values={values}
                    errors={errors}
                />
                <Form.Footer>
                    <Button color="primary" block={true}>
                        Iscriviti
                    </Button>
                </Form.Footer>
            </Form>
        )}
    />
);

export default LabsSelectorForm;