import React from "react";
import StandaloneFormPage from '../../StandaloneFormPage';
import { Form, Button, /*Card, Grid, Icon*/ } from 'tabler-react';
import { Spinner } from 'reactstrap';
import moment from 'moment';
import TWIcon from '../SiteWrapper/tw-icon.png';

import FormCard from '../../FormCard';

const LoginForm = ({
    onSubmit,
    onChange,
    onBlur,
    values,
    errors,
    isSubmitting,
    assemblyInfo
}) => (
    <StandaloneFormPage imageURL={TWIcon}>
        <FormCard
            title={"Iscrizioni per l'Assemblea d'Istituto del " + moment(assemblyInfo.date).format('DD/MM/YYYY')}
            text={true ? "Inserisci la tua matricola per entrare:" : ''}
            onSubmit={onSubmit}
        >
            {/* <Form.Group>
                <Card.Alert color="primary">
                    <Grid.Row>
                        <Grid.Col width={8}>
                            Sei gia' loggato come:
                            <br />
                            <b>Nome Cognome</b>
                        </Grid.Col>
                        <Grid.Col width={4}>
                            <span className="float-right">
                                <Button color="outline-primary">
                                    <Icon name="log-out" />
                                </Button>
                            </span>
                        </Grid.Col>
                    </Grid.Row>
                </Card.Alert>
            </Form.Group> */}
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
                <Form.Group className="mb-1">
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
            {errors.part ? <div className="input-feedback text-danger">{errors.part}</div> : null}
            <Form.Footer className="mt-3">
                <Button type="submit" color="primary" block={true}>
                    {isSubmitting ? <Spinner color="light" size="sm" /> : 'Entra'}
                </Button>
            </Form.Footer>
        </FormCard>
    </StandaloneFormPage>
);

export default LoginForm;