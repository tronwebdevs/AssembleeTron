import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribeLabs } from '../../../actions/studentActions';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'tabler-react';
import { Formik } from 'formik';
import LabSelectors from './LabSelectors';

const LabsSelectorForm = ({ labs, subscribeLabs, student }) => (
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
            setSubmitting(true);
            subscribeLabs(student.profile.ID, values, (err, data) => {
                setSubmitting(false);
                if (err) {
                    setErrors({ h1: err.message });
                } else if (data.code === -1) {
                    setErrors({ h1: data.message });
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
                    <Button type="submit" color="primary" block={true}>
                        Iscriviti
                    </Button>
                </Form.Footer>
            </Form>
        )}
    />
);

LabsSelectorForm.propTypes = {
    subscribeLabs: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { subscribeLabs })(LabsSelectorForm);