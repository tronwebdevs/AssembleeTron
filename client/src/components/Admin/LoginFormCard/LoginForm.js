import React from "react";
import StandaloneFormPage from '../../StandaloneFormPage';
import { Form, Button } from 'tabler-react';
import { Spinner } from 'reactstrap';

import FormCard from '../../FormCard';

const LoginForm = ({
    onSubmit,
    onChange,
    onBlur,
    values,
    errors,
    isSubmitting
}) => (
    <StandaloneFormPage imageURL={"https://www.tronweb.it/wp-content/uploads/2018/09/tw-logo.png"}>
        <FormCard
            title="Gestione"
            text={<div className="text-center">Zona riservata</div>}
            onSubmit={onSubmit}
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