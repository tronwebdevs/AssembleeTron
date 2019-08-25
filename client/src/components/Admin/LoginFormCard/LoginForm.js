import React from "react";
import StandaloneFormPage from '../../StandaloneFormPage';
import { Form, Button } from 'tabler-react';
import { Spinner } from 'reactstrap';
import TWIcon from './tw-icon.png';

import FormCard from '../../FormCard';

const LoginForm = ({
    onSubmit,
    onChange,
    onBlur,
    values,
    errors,
    isSubmitting,
    errorMessage
}) => (
    <StandaloneFormPage imageURL={TWIcon}>
        <FormCard
            title="Gestione"
            text="Zona riservata"
            onSubmit={onSubmit}
            pAlign="center"
            errorMessage={errorMessage}
        >
            <Form.Group>
                <Form.Input
                    type='password'
                    placeholder='Password'
                    name="password"
                    onChange={onChange}
                    onBlur={onBlur}
                    autoFocus={true}
                    value={values.password}
                    error={errors.password}
                />
            </Form.Group>
            <Form.Footer className="mt-1">
                <Button type="submit" color="primary" block={true}>
                    {isSubmitting ? <Spinner color="light" size="sm" /> : 'Login'}
                </Button>
            </Form.Footer>
        </FormCard>
    </StandaloneFormPage>
);

export default LoginForm;