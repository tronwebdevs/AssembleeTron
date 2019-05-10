import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFetchPending } from '../../../actions/assemblyActions';
import { Redirect, Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import LabsTable from '../../Student/LabsTable';
import Badge from '../../Student/Badge';
import Footer from '../../Footer/';

class ConfirmSub extends Component {

<<<<<<< HEAD
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

||||||| merged common ancestors
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

=======
>>>>>>> 11c2aef6a568bed921955ce02e5ba3147e9eb90b
    renderInfo = () => {
<<<<<<< HEAD
        if (this.state.notSub === false) {
||||||| merged common ancestors
        let student = { name: '', surname: '', classLabel: '' };
        if (student.labs) {
=======
        if (this.props.student.labs) {
>>>>>>> 11c2aef6a568bed921955ce02e5ba3147e9eb90b
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
    clearFetchPending: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { clearFetchPending })(ConfirmSub);
