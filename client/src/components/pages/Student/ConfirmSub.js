import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFetchPending } from '../../../actions/assemblyActions';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function SubTableRow(props) {
    const { h, lab } = props;
    return (
        <tr className="lab-row-confirm">
            <td>{h}</td>
            <td>{lab.title}</td>
            <td>{lab.room}</td>
        </tr>
    );
}

class ConfirmSub extends Component {

    state = { notSub: this.props.student.labs.every(labID => labID === -1) };

    renderLabs = () => {
        const { student } = this.props;
        const { labs } = this.props.assembly;
        if (this.state.notSub === false) {
            let labList = student.labs;
            labList = labList.map(labID => labs.find(aLab => aLab.ID === labID));
            console.log(labList);
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
                        {labList.map((lab, index) => <SubTableRow h={index + 1} lab={lab} key={index} />)}
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
        if (this.state.notSub === false) {
            return (
                <Row className="mb-1">
                    <Col>
                        <small>
                            <p className="font-weight-bold">
                                Conserva questa tabella! Ti consigliamo di salvare uno screenshot di questa schermata prima di uscire.
                            </p>
                            <p className="font-weight-bold">
                                Potrai visualizzarla nuovamente inserendo la tua matricola nella <Link to="/">pagina di login</Link>
                            </p>
                            <p>
                                Per disiscriverti dall'assemblea vai alla <Link to="/">pagina di login</Link> e seleziona "Non partecipo"
                            </p>
                        </small>
                    </Col>
                </Row>
            );
        }
    }

    componentDidMount() {
        this.props.clearFetchPending();
    }

    render() {
        const { profile } = this.props.student;
        let assDate;

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
                                            <Badge variant="primary">
                                                <h6 className="mb-0">{profile.name} {profile.surname} - {profile.classLabel}</h6>
                                            </Badge>
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
    clearFetchPending: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { clearFetchPending })(ConfirmSub);