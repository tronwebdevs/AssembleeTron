import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAllLabs } from '../../../actions/assemblyActions';
import { authSudoer } from '../../../actions/adminActions';
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Form,
	FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
	FormFeedback,
    Button,
    Spinner,
    Label
} from 'reactstrap';
import { Formik } from 'formik';
import { PageLoading } from '../../Admin';
import cogoToast from 'cogo-toast';
import axios from 'axios';

const RestrictedArea = ({ fetchAllLabs, authSudoer, assembly, admin }) => {
    const [editSub, setEditSub] = useState({ id: null });

	const { labs, pendings } = assembly;

	if (pendings.labs === undefined && assembly.exists === true) {
		fetchAllLabs();
    }

	if (pendings.assembly === false && pendings.labs === false) {
        if (admin.isSudo === true) {
            return (
                <Fragment>
                    <Row>
                        <Col xs="12" lg="4">
                            <Row>
                                <Col xs="12">
                                    <Card>
                                        <CardHeader>
                                            <b>Elimina Iscritto</b>
                                        </CardHeader>
                                        <CardBody>
                                            <Formik
                                                initialValues={{ studentID: '' }}
                                                onSubmit={(
                                                    values,
                                                    { setSubmitting, setErrors, resetForm }
                                                ) => {
                                                    axios
                                                        .delete(
                                                            '/api/students/' + values.studentID,
                                                            { headers: { Authorization: `Bearer ${admin.token}` } }
                                                        )
                                                        .then(() => {
                                                            setSubmitting(false);
                                                            resetForm();
                                                            cogoToast.success('Iscritto eliminato con successo');
                                                        })
                                                        .catch(err => {
                                                            const { response } = err;
                                                            if (response && response.data && response.data.message) {
                                                                err.message = response.data.message;
                                                            }
                                                            setErrors({
                                                                studentID: err.message
                                                            });
                                                            setSubmitting(false);
                                                        });
                                                }}
                                            >
                                                {({
                                                    values,
                                                    errors,
                                                    handleChange,
                                                    handleSubmit,
                                                    isSubmitting
                                                }) => (
                                                    <Form onSubmit={handleSubmit}>
                                                        <InputGroup>
                                                            <Input
                                                                type="number"
                                                                placeholder="Matricola"
                                                                name="studentID"
                                                                value={
                                                                    values.studentID
                                                                }
                                                                invalid={
                                                                    errors.studentID !==
                                                                    undefined
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <Button
                                                                    type="submit"
                                                                    color="danger"
                                                                    disabled={isSubmitting}
                                                                >
                                                                    {isSubmitting ? <Spinner/> : 'Elimina'}
                                                                </Button>
                                                            </InputGroupAddon>
                                                            <FormFeedback>
                                                                {errors.studentID}
                                                            </FormFeedback>
                                                        </InputGroup>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xs="12">
                                    <Card>
                                        <CardHeader>
                                            <b>Aggiungi Studente</b>
                                        </CardHeader>
                                        <CardBody>
                                            <Formik
                                                initialValues={{ 
                                                    studentID: '', 
                                                    name: '',
                                                    surname: '',
                                                    section: ''
                                                }}
                                                onSubmit={(
                                                    values,
                                                    { setSubmitting, setErrors, resetForm }
                                                ) => {
                                                    const { studentID, name, surname, section } = values;
                                                    axios
                                                        .post(
                                                            '/api/students/' + studentID + '/create',
                                                            { name, surname, section },
                                                            { headers: { Authorization: `Bearer ${admin.token}` } }
                                                        )
                                                        .then(() => {
                                                            setSubmitting(false);
                                                            resetForm();
                                                            cogoToast.success('Studente creato con successo');
                                                        })
                                                        .catch(err => {
                                                            const { response } = err;
                                                            if (response && response.data && response.data.message) {
                                                                err.message = response.data.message;
                                                            }
                                                            cogoToast.error(err.message);
                                                            setSubmitting(false);
                                                        });
                                                }}
                                            >
                                                {({
                                                    values,
                                                    handleChange,
                                                    handleSubmit,
                                                    isSubmitting
                                                }) => (
                                                    <Form onSubmit={handleSubmit}>
                                                        <FormGroup row>
                                                            <Label for="studentID" lg="3" xs="12">Matricola</Label>
                                                            <Col lg="9" xs="12">
                                                                <Input
                                                                    type="text"
                                                                    id="studentID"
                                                                    name="studentID"
                                                                    value={values.studentID}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label for="name" lg="3" xs="12">Nome</Label>
                                                            <Col lg="9" xs="12">
                                                                <Input
                                                                    type="text"
                                                                    id="name"
                                                                    name="name"
                                                                    value={values.name}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label for="surname" lg="3" xs="12">Cognome</Label>
                                                            <Col lg="9" xs="12">
                                                                <Input
                                                                    type="text"
                                                                    id="surname"
                                                                    name="surname"
                                                                    value={values.surname}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup row>
                                                            <Label for="section" lg="3" xs="12">Classe</Label>
                                                            <Col lg="9" xs="12">
                                                                <Input
                                                                    type="text"
                                                                    id="section"
                                                                    name="section"
                                                                    value={values.section}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup className="text-center">
                                                            <Button
                                                                type="submit"
                                                                color="primary"
                                                                disabled={isSubmitting}
                                                            >
                                                                {isSubmitting ? <Spinner/> : 'Salva'}
                                                            </Button>
                                                        </FormGroup>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs="12" lg="6">
                            <Card>
                                <CardHeader>
                                    <b>Modifica Iscritto</b>
                                </CardHeader>
                                <CardBody>
                                    <Formik
                                        initialValues={{ studentID: '' }}
                                        onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
                                            axios.get('/api/students/' + values.studentID + '?part=1')
                                                .then(({ data }) => {
                                                    if (data.subscribed === undefined) {
                                                        throw new Error('Studente non iscritto');
                                                    } else if (data.subscribed === true) {
                                                        setEditSub({
                                                            id: data.student.studentId,
                                                            subscribed: data.subscribed,
                                                            h1: data.labs[0]._id,
                                                            h2: data.labs[1]._id,
                                                            h3: data.labs[2]._id,
                                                            h4: data.labs[3]._id
                                                        });
                                                    } else {
                                                        setEditSub({
                                                            id: data.student.studentId,
                                                            subscribed: data.subscribed,
                                                            h1: '-1',
                                                            h2: '-1',
                                                            h3: '-1',
                                                            h4: '-1'
                                                        });
                                                    }
                                                    setSubmitting(false);
                                                })
                                                .catch(err => {
                                                    const { response } = err;
                                                    if (response && response.data && response.data.message) {
                                                        err.message = response.data.message;
                                                    }
                                                    setErrors({
                                                        studentID: err.message
                                                    });
                                                    setSubmitting(false);
                                                });
                                        }}
                                    >
                                        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <InputGroup>
                                                    <Input 
                                                        type="number"
                                                        id="studentID"
                                                        name="studentID"
                                                        value={values.studentID}
                                                        onChange={handleChange}
                                                        placeholder="Matricola"
                                                        invalid={errors.studentID !== undefined}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <Button
                                                            type="submit"
                                                            color="primary"
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? <Spinner/> : 'Trova'}
                                                        </Button>
                                                    </InputGroupAddon>
                                                    <FormFeedback>
                                                        {errors.studentID}
                                                    </FormFeedback>
                                                </InputGroup>
                                            </Form>
                                        )}
                                    </Formik>
                                    <Formik
                                        initialValues={{
                                            studentID: editSub.id || '',
                                            h1: editSub.h1 || 'default',
                                            h2: editSub.h2 || 'default',
                                            h3: editSub.h3 || 'default',
                                            h4: editSub.h4 || 'default'
                                        }}
                                        onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
                                            console.log(values)
                                            setSubmitting(false);
                                        }}
                                        enableReinitialize={true}
                                    >
                                        {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                                            <Form onSubmit={handleSubmit} className="mt-5">
                                                <FormGroup row>
                                                    <Label for="h1" lg="2" xs="12">Ora 1</Label>
                                                    <Col lg="10" xs="12">
                                                        <Input 
                                                            type="select"
                                                            id="h1"
                                                            name="h1"
                                                            value={values.h1}
                                                            onChange={handleChange}
                                                            disabled={values.studentID === ''}
                                                        >
                                                            <option
                                                                value="default"
                                                                disabled
                                                            >Seleziona un laboratorio</option>
                                                            {labs.map((lab, index) => (
                                                                <option 
                                                                    key={index} 
                                                                    value={lab._id}
                                                                >
                                                                    {lab.title}
                                                                </option>
                                                            ))}
                                                            <option value="-1">Non partecipa</option>
                                                        </Input>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label for="h2" lg="2" xs="12">Ora 2</Label>
                                                    <Col lg="10" xs="12">
                                                        <Input 
                                                            type="select"
                                                            id="h2"
                                                            name="h2"
                                                            value={values.h2}
                                                            onChange={handleChange}
                                                            disabled={values.studentID === ''}
                                                        >
                                                            <option
                                                                value="default"
                                                                disabled
                                                            >Seleziona un laboratorio</option>
                                                            {labs.map((lab, index) => (
                                                                <option 
                                                                    key={index} 
                                                                    value={lab._id}
                                                                >
                                                                    {lab.title}
                                                                </option>
                                                            ))}
                                                            <option value="-1">Non partecipa</option>
                                                        </Input>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label for="h3" lg="2" xs="12">Ora 3</Label>
                                                    <Col lg="10" xs="12">
                                                        <Input 
                                                            type="select"
                                                            id="h3"
                                                            name="h3"
                                                            value={values.h3}
                                                            onChange={handleChange}
                                                            disabled={values.studentID === ''}
                                                        >
                                                            <option
                                                                value="default"
                                                                disabled
                                                            >Seleziona un laboratorio</option>
                                                            {labs.map((lab, index) => (
                                                                <option 
                                                                    key={index} 
                                                                    value={lab._id}
                                                                >
                                                                    {lab.title}
                                                                </option>
                                                            ))}
                                                            <option value="-1">Non partecipa</option>
                                                        </Input>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label for="h4" lg="2" xs="12">Ora 4</Label>
                                                    <Col lg="10" xs="12">
                                                        <Input 
                                                            type="select"
                                                            id="h4"
                                                            name="h4"
                                                            value={values.h4}
                                                            onChange={handleChange}
                                                            disabled={values.studentID === ''}
                                                        >
                                                            <option
                                                                value="default"
                                                                disabled
                                                            >Seleziona un laboratorio</option>
                                                            {labs.map((lab, index) => (
                                                                <option 
                                                                    key={index} 
                                                                    value={lab._id}
                                                                >
                                                                    {lab.title}
                                                                </option>
                                                            ))}
                                                            <option value="-1">Non partecipa</option>
                                                        </Input>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup className="text-center">
                                                    <Button 
                                                        type="submit" 
                                                        color="primary"
                                                        disabled={isSubmitting || values.studentID === ''}
                                                    >
                                                        {isSubmitting ? <Spinner /> : 'Salva'}
                                                    </Button>
                                                </FormGroup>
                                            </Form>
                                        )}
                                    </Formik>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" lg="2">
                            <Card>
                                <CardBody>
                                    Bella per te fratm, se sei qui spero 
                                    tu sia del TW, non fare casini, cya
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Fragment>
            );
        } else {
            return (
                <Row>
                    <Col lg={{ size: 4, offset: 4 }}>
                        <Card>
                            <CardHeader>
                                <b>Autenticazione richesta</b>
                            </CardHeader>
                            <CardBody>
                                <Formik 
                                    initialValues={{ password: ''}}
                                    onSubmit={(values, { setSubmitting, setErrors }) => {
                                        authSudoer(values.password)
                                            .then(() => setSubmitting(false))
                                            .catch(err => {
                                                const { response } = err;
                                                if (response && response.data && response.data.message) {
                                                    err.message = response.data.message;
                                                }
                                                setErrors({
                                                    password: err.message
                                                });
                                                setSubmitting(false);
                                            });
                                    }}
                                >
                                    {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup>
                                                <Input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    values={values.password}
                                                    onChange={handleChange}
                                                    invalid={errors.password !== undefined}
                                                    placeholder="Sudoer password"
                                                />
                                                <FormFeedback>{errors.password}</FormFeedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <Button 
                                                    type="submit" 
                                                    color="primary" 
                                                    style={{float: 'right'}}
                                                >Entra</Button>
                                            </FormGroup>
                                        </Form>
                                    )}
                                </Formik>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            );
        }
	} else {
		return <PageLoading />;
	}
};

RestrictedArea.propTypes = {
    assembly: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    fetchAllLabs: PropTypes.func.isRequired,
    authSudoer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly,
    admin: state.admin
});

export default connect(mapStateToProps, { fetchAllLabs, authSudoer })(RestrictedArea);
