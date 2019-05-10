import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchLabsAvabile } from '../../../actions/assemblyActions';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Footer from '../../Footer';

import Badge from '../../Student/Badge';
import LabSelector from '../../Student/LabSelector';
import LabShow from '../../Student/LabShow';
import ErrorAlert from '../../Student/ErrorAlert';

class LabsSelect extends Component {

    componentDidMount() {
        this.props.fetchLabsAvabile(this.props.student.profile.classLabel);
    }

    onSubmit = event => {
        event.preventDefault();
        console.log(event);
    }

    render() {
        const { profile, labs, authed } = this.props.student;

        if (authed !== true) {
            return <Redirect to={{ pathname: "/" }} />;
        } else if (labs.length > 0) {
            return <Redirect to={{ pathname: "/conferma" }} />;
        }

        const { avabile_labs, error } = this.props.assembly;

        return (
            <>
                <Container className="std-page">
                    <ErrorAlert message={error.labs} />
                    <Row className="mt-1">
                        <Col>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <Badge student={profile} />
                                    <Row className="mb-2">
                                        <Col>
                                            <Card.Title className="display-4">Laboratori</Card.Title>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2 px-2">
                                        {avabile_labs.map((lab, index) => <LabShow key={index} title={lab.title} description={lab.description} /> )}
                                    </Row>
                                    <Row className="mb-3">
                                        <Col className="text-uppercase">
                                            <p style={{fontSize: '0.7em', color: '#c9c9c9'}}>- Informazioni gentilmente offerte dai Rappresentanti d'Istituto -</p>
                                            <u style={{fontSize: '0.9em'}}>Per i progetti da <b>due ore</b> seleziona la prima e la seconda ora o la terza e la quarta ora.</u>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col>
                                            <Form validated={false} noValidate className="row">
                                                {[1, 2, 3, 4].map(h => <LabSelector key={h} labs={avabile_labs} h={h} /> )}
                                                <Col className="text-center">
                                                    <Form.Group className="mt-3 mb-0">
                                                        <Button type="submit" variant="primary">Iscriviti</Button>
                                                    </Form.Group>
                                                </Col>
                                            </Form>
                                        </Col>
                                    </Row>
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

LabsSelect.propTypes = {
    fetchLabsAvabile: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    student: state.student,
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchLabsAvabile })(LabsSelect);