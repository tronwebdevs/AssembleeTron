import React, { Component } from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Authentication from '../../AuthRoute/Authentication';
import './index.css';

class Login extends Component {
    state = {
        matricola: 0,
        part: 1,
        redirectToReferrer: false
    };

    login = () => {
        Authentication.signin(() => {
            this.setState({ redirectToReferrer: true });
        });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;

        return (
            <Form className="form-signin">
                <Card className="mb-4 shadow-sm">
                    <Card.Body className="text-center">
                        <Card.Title>Iscrizioni per l'Assemblea d'Istituto del </Card.Title>
                        <Card.Text className="text-left" style={{ fontSize: '0.9em' }}>
                            Inserisci la tua matricola per entrare:
                    </Card.Text>
                        <Form.Group>
                            <Form.Control type="number" placeholder="Matricola" required autoFocus />
                        </Form.Group>
                        <Form.Group>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="partRadio" name="part" className="custom-control-input" value="1" checked />
                                <label className="custom-control-label" htmlFor="partRadio">Partecipo</label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="notPartRadio" name="part" className="custom-control-input" value="0" />
                                <label className="custom-control-label" htmlFor="notPartRadio">Non partecipo</label>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" block>Entra</Button>
                    </Card.Body>
                </Card>
            </Form>
        );
    }
}

export default Login;