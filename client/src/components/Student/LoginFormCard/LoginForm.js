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
            title="Iscrizioni per l'Assemblea d'Istituto del 23/12/2020"
            text="Inserisci la tua matricola per entrare:"
            onSubmit={onSubmit}
        >
            <Form.Group>
                <Form.Input
                    type='text'
                    placeholder='Matricola'
                    name="studentID"
                    onChange={onChange}
                    onBlur={onBlur}
                    autoFocus={true}
                    value={values.studentID}
                    error={errors.studentID}
                />
            </Form.Group>
            <span className="text-center">
                <Form.Group>
                    <Form.Radio
                        label="Partecipo"
                        name="part"
                        value="1"
                        checked={values.part === '1'}
                        onChange={onChange}
                        onBlur={onBlur}
                        isInline
                        />
                    <Form.Radio
                        label="Non partecipo"
                        name="part"
                        value="0"
                        onChange={onChange}
                        onBlur={onBlur}
                        checked={values.part === '0'}
                        isInline
                    />
                </Form.Group>
            </span>
            <Form.Footer className="mt-1">
                <Button type="submit" color="primary" block={true}>
                    {isSubmitting ? <Spinner color="light" size="sm" /> : 'Entra'}
                </Button>
            </Form.Footer>
        </FormCard>
    </StandaloneFormPage>
);

export default LoginForm;