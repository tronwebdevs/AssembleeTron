import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { CustomInput, FormGroup } from 'reactstrap';
import { Formik } from 'formik';
import FormCard from '../../FormCard/';
import StudentSectionRadio from '../../Student/StudentSectionRadio';
import StandaloneFormPage from '../../StandaloneFormPage/';

const Verification = ({
    student,
    assembly
}) => {

    const { pendings, profile, labs } = student;
    const { info } = assembly;

    // if (profile.studentId === null) {
	// 	return <Redirect to={{ pathname: '/' }} />;
	// } else if (labs !== null || profile.verified === true) {
	// 	return <Redirect to={{ pathname: '/conferma' }} />;
	// }

    return (
        <StandaloneFormPage>
            <Formik
                initialValues={{
                    studentSection: ''
                }}
                onSubmit={(values, { setSubmitting, setErrors }) =>
                    alert(values.value)
                }
                render={({
                    values,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting
                }) => (
                    <FormCard
                        title='Verifica'
                        subtitle='Dimostra di essere veramente tu'
                        text='Seleziona la tua classe tra quelle elencate'
                        onSubmit={handleSubmit}
                    >
                        <div style={{ paddingTop: '.25rem' }}>
                            <StudentSectionRadio 
                                label="Test 1"
                                value={"test1"} 
                                checked={values.studentSection === "test1"}
                                setFieldValue={setFieldValue} 
                            />
                            <StudentSectionRadio 
                                label="Test 2"
                                value={"test2"} 
                                checked={values.studentSection === "test2"}
                                setFieldValue={setFieldValue} 
                            />
                            <StudentSectionRadio 
                                label="Test 3"
                                value={"test3"} 
                                checked={values.studentSection === "test3"}
                                setFieldValue={setFieldValue} 
                            />
                        </div>
                    </FormCard>
                )}
	        />
	    </StandaloneFormPage>
    );
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, {})(Verification);