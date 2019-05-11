import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFetchPending } from '../../../actions/assemblyActions';
import { Redirect, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import LabsTable from '../../Student/LabsTable';
import Badge from '../../Student/Badge';
import Footer from '../../Footer/';

class ConfirmSub extends Component {

    state = { notSub: this.props.student.labs.every(labID => labID === -1) };

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

        const { profile, labs, authed } = this.props.student;
        
        if (authed !== true || labs.length <= 0) {
            return <Redirect to={{ pathname: "/" }} />;
        }

        
        const { assembly } = this.props;
        const { date } = assembly.info;
        
        const showLabs = labs.map(labID => assembly.labs.find(lab => lab.ID === labID));

        return (
            <>
                <Container className="std-page">
                    <Row className="mt-4">
                        <Col>
                            <Card className="text-center shadow-sm">
                                <CardBody>
                                    <Row className="mb-2">
                                        <Col>
                                            <CardTitle>Iscrizioni per l'Assemblea d'Istituto del {date}</CardTitle>
                                        </Col>
                                    </Row>
                                    <Badge student={profile} />
                                    <Row className="mb-2">
                                        <Col>
                                            <LabsTable labs={showLabs} />
                                        </Col>
                                    </Row>
                                    {this.renderInfo()}
                                </CardBody>
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
