import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authStudent } from '../../../actions/studentActions';
import { fetchAssemblyInfo } from '../../../actions/assemblyActions';
import { Form, Card, Button } from 'react-bootstrap';
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

    render() {
        const { info } = this.props.assembly;
        return (
            <Form className="form-signin" onSubmit={this.handleSubmit}>
                <Card className="mb-4 shadow-sm">
                    <Card.Body className="text-center">
                        <Card.Title>Iscrizioni per l'Assemblea d'Istituto del {moment(info.date).format('DD/MM/YYYY')}</Card.Title>
                        <Card.Text className="text-left" style={{ fontSize: '0.9em' }}>
                            Inserisci la tua matricola per entrare:
                        </Card.Text>
                        <Form.Group>
                            <Form.Control
                                type="number"
                                className="login-input"
                                name="studentID"
                                placeholder="Matricola"
                                onChange={this.handleChange}
                                required
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                type="radio"
                                custom
                                className="custom-control-inline"
                                label="Partecipo"
                                id="partRadio"
                                name="part"
                                value={1}
                                onChange={this.handleChange}
                                checked={this.state.part === 1}
                            />
                            <Form.Check
                                type="radio"
                                custom
                                className="custom-control-inline"
                                label="Non partecipo"
                                id="notPartRadio"
                                name="part"
                                value={0}
                                onChange={this.handleChange}
                                checked={this.state.part === 0}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" block>Entra</Button>
                    </Card.Body>
                </Card>
            </Form>
        );
    }
}

LoginComponent.propTypes = {
    authStudent: PropTypes.func.isRequired,
    fetchAssemblyInfo: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { authStudent, fetchAssemblyInfo })(LoginComponent);