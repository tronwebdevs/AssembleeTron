import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribeLabs } from '../../../actions/studentActions';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'tabler-react';
import { Spinner } from 'reactstrap';
import { Formik } from 'formik';

import LabSelector from './LabSelector/';

const LabsSelectorForm = ({ labs, subscribeLabs, student, setGlobalError }) => (
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
            subscribeLabs(student.profile.ID, values, (err, data) => {
                setSubmitting(false);
                if (err) {
                    setGlobalError(err.message);
                } else if (data.code === -1) {
                    if (!data.target || data.target === 0) {
                        setGlobalError(data.message);
                    } else {
                        setErrors({ ['h' + data.target]: data.message });
                    }
                } else {
                    return <Redirect to={{ pathname: '/conferma' }} />;
                }
            });
        }}
        render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
        }) => (
            <Form onSubmit={handleSubmit} className="pt-2">
                {[1, 2, 3, 4].map(h => <LabSelector key={h} labs={labs} h={h} onChange={handleChange} error={errors['h' + h]} value={values['h' + h]} />)}
                <Form.Footer>
                    <Button type="submit" color="primary" block={true}>
                        {isSubmitting ? <Spinner color="light" size="sm" /> : 'Iscriviti'}
                    </Button>
                </Form.Footer>
            </Form>
        )}
    />
);

LabsSelectorForm.propTypes = {
    labs: PropTypes.array.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
    subscribeLabs: PropTypes.func.isRequired,
    setGlobalError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { subscribeLabs })(LabsSelectorForm);