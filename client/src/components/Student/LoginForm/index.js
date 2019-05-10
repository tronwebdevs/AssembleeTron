import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authStudent } from '../../../actions/studentActions';
import { fetchAssemblyInfo } from '../../../actions/assemblyActions';
import { Form, FormGroup, Input, CustomInput, Card, CardBody, CardTitle, CardText, Button, Spinner } from 'reactstrap';
import moment from 'moment';
import './index.css';


class LoginComponent extends Component {
    state = {
        studentID: 0,
        part: 1
    };

    handleChange = event => {
        this.setState({ [event.target.name]: +event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.authStudent(this.state.studentID, this.state.part);
    }

    renderBtnText = () => {
        if (this.props.fetchPending === true) {
            return <Spinner animation="border" variant="light" size="sm" />;
        } else {
            return 'Entra';
        }
    }

    render() {
        const { info } = this.props.assembly;
        return (
            <Form className="form-signin" onSubmit={this.handleSubmit}>
                <Card className="mb-4 shadow-sm">
                    <CardBody className="text-center">
                        <CardTitle>Iscrizioni per l'Assemblea d'Istituto del {moment(info.date).format('DD/MM/YYYY')}</CardTitle>
                        <CardText className="text-left" style={{ fontSize: '0.9em' }}>
                            Inserisci la tua matricola per entrare:
                        </CardText>
                        <FormGroup>
                            <Input
                                type="number"
                                className="login-input"
                                name="studentID"
                                placeholder="Matricola"
                                onChange={this.handleChange}
                                required
                                autoFocus
                            />
                        </FormGroup>
                        <FormGroup>
                            <CustomInput
                                type="radio"
                                className="custom-control-inline"
                                label="Partecipo"
                                id="partRadio"
                                name="part"
                                value={1}
                                onChange={this.handleChange}
                                checked={this.state.part === 1}
                            />
                            <CustomInput
                                type="radio"
                                className="custom-control-inline"
                                label="Non partecipo"
                                id="notPartRadio"
                                name="part"
                                value={0}
                                onChange={this.handleChange}
                                checked={this.state.part === 0}
                            />
                        </FormGroup>
                        <Button color="primary" type="submit" block>
                            {this.renderBtnText()}
                        </Button>
                    </CardBody>
                </Card>
            </Form>
        );
    }
}

LoginComponent.propTypes = {
    authStudent: PropTypes.func.isRequired,
    fetchAssemblyInfo: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
    fetchPending: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
	student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { authStudent, fetchAssemblyInfo })(LoginComponent);
