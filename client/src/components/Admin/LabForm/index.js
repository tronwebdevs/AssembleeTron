import React from 'react';
import { connect } from 'react-redux';
import { updateAssemblyLab, createAssemblyLab } from '../../../actions/assemblyActions';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Form from './Form';
import { Card } from 'tabler-react';

const LabForm = ({ 
    id, 
    lab, 
    action, 
    handleReset,
    setDisplayMessage,
    updateAssemblyLab,
    createAssemblyLab,
    assembly
}) => (
    <div id="form-card-wrapper">

        <Card>
            <Card.Body>
                <Card.Title>{action === 'edit' ? 'Modifica' : 'Crea'} laboratorio</Card.Title>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        ID: lab.ID || id,
                        room: lab.room || "",
                        title: lab.title || "",
                        description: lab.description || "",
                        seatsH1: lab.seatsH1 || 0,
                        classesH1: (lab.classesH1 || []).map(cl => ({ label: cl, value: cl })),
                        seatsH2: lab.seatsH2 || 0,
                        classesH2: (lab.classesH2 || []).map(cl => ({ label: cl, value: cl })),
                        seatsH3: lab.seatsH3 || 0,
                        classesH3: (lab.classesH3 || []).map(cl => ({ label: cl, value: cl })),
                        seatsH4: lab.seatsH4 || 0,
                        classesH4: (lab.classesH4 || []).map(cl => ({ label: cl, value: cl })),
                        lastsTwoH: lab.lastsTwoH
                    }}
                    validate={values => {
                        let errors = {};
                        if (values.ID !== lab.ID) {
                            const { labs } = assembly;
                            labs.forEach(lab => {
                                if (lab.ID === values.ID) {
                                    errors.ID = "ID duplicato";
                                }
                                if (lab.room === values.room.trim()) {
                                    errors.room = `Classe identica al laboratorio ${lab.ID}`;
                                }
                                if (lab.title === values.title.trim()) {
                                    errors.title = `Esiste gia' un laboratorio con questo titolo (${lab.ID})`;
                                }
                                if (lab.description === values.description.trim() && values.description !== "-") {
                                    errors.description = "Classe duplicato";
                                }
                            });
                        }
                        
                        return errors;
                    }}
                    onSubmit={(
                        values,
                        { setSubmitting, setErrors }
                    ) => {
                        let lab = {
                            ID: values.ID,
                            room: values.room,
                            title: values.title,
                            description: values.description || "",
                            seatsH1: values.seatsH1 || 0,
                            classesH1: (values.classesH1 || []).map(({ label, value }) => label),
                            seatsH2: values.seatsH2 || 0,
                            classesH2: (values.classesH2 || []).map(({ label, value }) => label),
                            seatsH3: values.seatsH3 || 0,
                            classesH3: (values.classesH3 || []).map(({ label, value }) => label),
                            seatsH4: values.seatsH4 || 0,
                            classesH4: (values.classesH4 || []).map(({ label, value }) => label),
                            lastsTwoH: values.lastsTwoH
                        }
                        if (action === 'edit') {
                            updateAssemblyLab(lab, (err, lab) => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setSubmitting(false);
                                if (err) {
                                    setDisplayMessage({
                                        type: 'error',
                                        message: err.message
                                    });
                                } else {
                                    setDisplayMessage({
                                        type: 'success',
                                        message: `Laboratorio ${lab.ID} modificato con successo`
                                    });
                                }
                            });
                        } else {
                            createAssemblyLab(lab, (err, lab) => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setSubmitting(false);
                                if (err) {
                                    setDisplayMessage({
                                        type: 'error',
                                        message: err.message
                                    });
                                } else {
                                    setDisplayMessage({
                                        type: 'success',
                                        message: `Laboratorio ${lab.ID} creato con successo`
                                    });
                                }
                            });
                        }
                    }}
                    onReset={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        handleReset()
                    }}
                    render={({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset,
                        isSubmitting,
                        setFieldValue
                    }) => (
                            <Form
                                values={values}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                handleSubmit={handleSubmit}
                                handleReset={handleReset}
                                isSubmitting={isSubmitting}
                                setFieldValue={setFieldValue}
                            />
                        )}
                />
            </Card.Body>
        </Card>
    </div>
);

LabForm.propTypes = {
    updateAssemblyLab: PropTypes.func.isRequired,
    createAssemblyLab: PropTypes.func.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { updateAssemblyLab, createAssemblyLab })(LabForm);