import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchLabsAvabile } from '../../../actions/assemblyActions';
import { Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Button, Collapse } from 'reactstrap';
import Footer from '../../Footer';
import Badge from '../../Student/Badge';
import LabSelector from '../../Student/LabSelector';
import LabShow from '../../Student/LabShow';
import ErrorAlert from '../../Student/ErrorAlert';

class LabsSelect extends Component {

    state = {
        collapse: false,
        h1: '',
        h2: '',
        h3: '',
        h4: ''
    }

    toggleLabList = () => {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    onChange = event => {
        console.log(event);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

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
                <Container className="std-page pt-4">
                    {error.labs ? <ErrorAlert message={error.labs}/> : ''}
                    <Row>
                        <Col>
                            <Card className="text-center shadow-sm">
                                <CardBody>
                                    <Badge student={profile} />
                                    <Row className="mb-2">
                                        <Col>
                                            <CardTitle className="display-4">Laboratori</CardTitle>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2 px-2">
                                        <Col className="text-center">
                                            <Button color="link" onClick={this.toggleLabList} style={{ marginBottom: '1rem' }}>
                                                {(this.state.collapse ? 'Nascondi' : 'Mostra') + ' la lista dei laboratori' }
                                            </Button>
                                            <Collapse isOpen={this.state.collapse}>
                                                {avabile_labs.map((lab, index) => <LabShow key={index} title={lab.title} description={lab.description} />)}
                                                <p className="text-uppercase" style={{ fontSize: '0.7em', color: '#c9c9c9' }}>- Informazioni gentilmente offerte dai Rappresentanti d'Istituto -</p>
                                            </Collapse>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col className="text-uppercase">
                                            <u style={{ fontSize: '0.9em' }}>Per i progetti da <b>due ore</b> seleziona la prima e la seconda ora o la terza e la quarta ora.</u>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col>
                                            <Form className="row" onSubmit={this.onSubmit}>
                                                {[1, 2, 3, 4].map(h => <LabSelector key={h} labs={avabile_labs} h={h} onChange={this.onChange} />)}
                                                <Col className="text-center">
                                                    <FormGroup className="mt-3 mb-0">
                                                        <Button type="submit" color="primary">Iscriviti</Button>
                                                    </FormGroup>
                                                </Col>
                                            </Form>
                                        </Col>
                                    </Row>
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