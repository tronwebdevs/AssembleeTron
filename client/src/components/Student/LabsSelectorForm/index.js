import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribeLabs, fetchAvabileLabs } from '../../../actions/studentActions';
import { Form, FormGroup, Button, Spinner } from 'reactstrap';
import { Formik } from 'formik';

import LabSelector from './LabSelector/';

const LabsSelectorForm = ({ 
    labs, 
    subscribeLabs, 
    fetchAvabileLabs,
    student, 
    setGlobalError
}) => (
    <Formik
        initialValues={{
            h1: 'default',
            h2: 'default',
            h3: 'default',
            h4: 'default'
        }}
        onSubmit={(
            values,
            { setSubmitting, setErrors }
        ) => {
            let errors = {};
            for (let i = 1; i <= 4; i++) {
                if (!values['h' + i] || values['h' + i] === 'default') {
                    errors['h' + i] = 'Scegli un laboratorio per quest\'ora';
                }
            }

            const { profile } = student;

            if (Object.entries(errors).length === 0 && errors.constructor === Object) {
                subscribeLabs(profile.studentId, values)
                    .then(() => {
                        setSubmitting(false);
                        setGlobalError(null);
                    })
                    .catch(({ message, target }) => {
                        let globalError;
                        if (!target || target === 0) {
                            globalError = message;
                            setGlobalError(message);
                        } else {
                            setGlobalError(null);
                            setErrors({ ['h' + target]: message });
                        }
                        fetchAvabileLabs(profile.section)
                            .then(() => setSubmitting(false))
                            .catch(({ message }) => {
                                setSubmitting(false);
                                setGlobalError(globalError + '\n' + message);
                            });
                    });
            } else {
                setSubmitting(false);
                setErrors(errors);
            }
        }}
        render={({
            values,
            errors,
            handleChange,
            handleSubmit,
            isSubmitting
        }) => (
            <Form onSubmit={handleSubmit} className="pt-2">
                {[1, 2, 3, 4].map(h => (
                    <LabSelector 
                        key={h} 
                        labs={labs} 
                        h={h} 
                        onChange={handleChange} 
                        error={errors['h' + h]} 
                        value={values['h' + h]} 
                    />
                ))}
                <FormGroup className="mb-0 pt-2">
                    <Button type="submit" color="primary" block disabled={isSubmitting}>
                        {isSubmitting ? <Spinner color="light" size="sm" /> : 'Iscriviti'}
                    </Button>
                </FormGroup>
            </Form>
        )}
    />
);

LabsSelectorForm.propTypes = {
    labs: PropTypes.array.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
    subscribeLabs: PropTypes.func.isRequired,
    fetchAvabileLabs: PropTypes.func.isRequired,
    setGlobalError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { subscribeLabs, fetchAvabileLabs })(LabsSelectorForm);