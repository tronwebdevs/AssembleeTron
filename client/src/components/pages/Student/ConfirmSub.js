import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import LabsTable from '../../Student/LabsTable';
import Badge from '../../Student/Badge';
import Footer from '../../Footer/';

class ConfirmSub extends Component {

    renderInfo = () => {
        if (this.props.student.labs) {
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

        const { profile, labs, authed } = this.props.student;
        
        if (authed !== true || labs.length <= 0) {
            return <Redirect to={{ pathname: "/" }} />;
        }
        
        const { date } = this.props.assembly.info;

        return (
            <>
                <Container className="std-page">
                    <Row className="mt-4">
                        <Col>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <Row className="mb-2">
                                        <Col>
                                            <Card.Title>Iscrizioni per l'Assemblea d'Istituto del {date}</Card.Title>
                                        </Col>
                                    </Row>
                                    <Badge student={profile} />
                                    <Row className="mb-2">
                                        <Col>
                                            <LabsTable labs={labs} />
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
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps)(ConfirmSub);