import React from "react";
import PropTypes from "prop-types";
import { Form, FormGroup, Button, Spinner } from "reactstrap";
import { Formik } from "formik";

import LabSelector from "./LabSelector/";

const LabsSelectorForm = ({
    labs,
    subscribeLabs,
    fetchAvabileLabs,
    profile,
    tot_h,
    setGlobalError
}) => {
    let initialValues = {};
    for (let i = 0; i < tot_h; i++) {
        initialValues['h' + i] = 'default';
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, setErrors }) => {
                let errors = {};
                for (let i = 0; i < tot_h; i++) {
                    if (!values["h" + i] || values["h" + i] === "default") {
                        errors["h" + i] = "Scegli un laboratorio per quest'ora";
                    }
                }

                if (
                    Object.entries(errors).length === 0 &&
                    errors.constructor === Object
                ) {
                    subscribeLabs(profile.studentId, Object.values(values))
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
                                setErrors({ ["h" + target]: message });
                                values["h" + target] = "default";
                            }
                            fetchAvabileLabs(profile.section)
                                .then(() => setSubmitting(false))
                                .catch(({ message }) => {
                                    setSubmitting(false);
                                    setGlobalError(globalError + "\n" + message);
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
                    {[...Array(tot_h).keys()].map(i => (
                        <LabSelector
                            key={i}
                            labs={labs}
                            h={i}
                            onChange={handleChange}
                            error={errors["h" + i]}
                            value={values["h" + i]}
                        />
                    ))}
                    <FormGroup className="mb-0 pt-2">
                        <Button
                            type="submit"
                            color="primary"
                            block
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Spinner color="light" size="sm" />
                            ) : (
                                "Iscriviti"
                            )}
                        </Button>
                    </FormGroup>
                </Form>
            )}
        />
    );
};

LabsSelectorForm.propTypes = {
    labs: PropTypes.array.isRequired,
    subscribeLabs: PropTypes.func.isRequired,
    fetchAvabileLabs: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    tot_h: PropTypes.number.isRequired,
    setGlobalError: PropTypes.func.isRequired
};

export default LabsSelectorForm;
