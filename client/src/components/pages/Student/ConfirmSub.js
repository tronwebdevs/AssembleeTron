import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import Footer from './Footer';

class ConfirmSub extends Component {

    renderLabs = () => {
        let student = { name: '', surname: '', classLabel: '' };
        if (student.labs) {
            return (
                <Table responsive>
                    <thead>
                        <tr>
                            <th scope="col">Ora</th>
                            <th scope="col">Attività</th>
                            <th scope="col">Aula</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {/* {{#each student.labs}}
                        <tr className="lab-row-confirm">
                            <td>{{this.index}}</td>
                            <td>{{this.labName}}</td>
                            <td>{{this.labAula}}</td>
                        </tr>
                        {{/each}} */}
                    </tbody>
                </Table>
            );
        } else {
            return (
                <div className="text-center font-weight-bold text-uppercase">
                    <span className="text-danger">Non partecipi all'assemblea</span>
                </div>
            );
        }
    }

    renderInfo = () => {
        let student = { name: '', surname: '', classLabel: '' };
        if (student.labs) {
            return (
                <Row className="mb-1">
                    <Col>
                        <small>
                            <p className="font-weight-bold">
                                Conserva questa tabella! Ti consigliamo di salvare uno screenshot di questa schermata prima di uscire.
                            </p>
                            <p className="font-weight-bold">
                                Potrai visualizzarla nuovamente inserendo la tua matricola nella <a href="/logout">pagina di login</a>
                            </p>
                            <p>
                                Per disiscriverti dall'assemblea vai alla <a href="/logout">pagina di login</a> e seleziona "Non partecipo"
                            </p>
                        </small>
                    </Col>
                </Row>
            );
        }
    }

    render() {
        let assDate, student = { name: '', surname: '', classLabel: '' };

        return (
            <>
                <Container className="std-page">
                    <Row className="mt-4">
                        <Col>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <Row className="mb-2">
                                        <Col>
                                            <Card.Title>Iscrizioni per l'Assemblea d'Istituto del {assDate}</Card.Title>
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col>
                                            <Badge variant="primary">{student.name} {student.surname} - {student.classLabel}</Badge>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col>
                                            {this.renderLabs()}
                                        </Col>
                                    </Row>
                                    {this.renderInfo()}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </>
        );
    }
}

ConfirmSub.propTypes = {
    student: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student
});

export default connect(mapStateToProps, {})(ConfirmSub);