import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchLabsAvabile } from '../../../../actions/assemblyActions';
import { Container, Row, Col, Card, Badge, Form, Alert, Button } from 'react-bootstrap';
import Footer from '../Footer';

import LabComponent from './LabComponent';
import LabSelector from './LabSelector';

class LabsSelect extends Component {

    componentDidMount() {
        this.props.fetchLabsAvabile(this.props.student.profile.classLabel);
    }

    showErrors = () => {
        const { error } = this.props;
        if (error) {
            return (
                <Col>
                    <Alert variant="danger">{error}</Alert>
                </Col>
            );
        }
    }

    onSubmit = event => {
        event.preventDefault();
        console.log(event);
    }

    renderLabs = () => {
        const { avabile_labs } = this.props.assembly;
        if (avabile_labs) {
            return avabile_labs.map(lab => <LabComponent key={lab.ID} lab={lab} /> );
        } else {
            return;
        }
    }

    render() {
        const { profile } = this.props.student;
        return (
            <>
                <Container className="std-page">
                    <Row className="mt-4">{this.showErrors()}</Row>
                    <Row className="mt-1">
                        <Col>
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <Row className="mb-2">
                                        <Col>
                                            <Badge variant="primary">
                                                <h6 className="mb-0">{profile.name} {profile.surname} - {profile.classLabel}</h6>
                                            </Badge>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col>
                                            <Card.Title className="display-4">Laboratori</Card.Title>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2 px-2">
                                        {this.renderLabs()}
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
                                                {[1, 2, 3, 4].map(h => <LabSelector key={h} h={h} /> )}
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