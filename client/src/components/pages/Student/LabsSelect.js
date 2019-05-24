import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchLabsAvabile } from '../../../actions/assemblyActions';
import { Page, Grid, Card, Badge as TBadge } from 'tabler-react';
import Footer from '../../Footer';
import Badge from '../../Student/Badge';
import LabsSelectorForm from '../../Student/LabsSelectorForm/';
import LabShow from '../../Student/LabShow';
import ErrorAlert from '../../Student/ErrorAlert';
import SiteWrapper from '../../Student/SiteWrapper';

class LabsSelect extends Component {

    state = {
        collapse: false
    }

    toggleLabList = () => {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    componentDidMount() {
        this.props.fetchLabsAvabile(this.props.student.profile.classLabel);
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
            <SiteWrapper>
                <Page.Content title="Laboratori">
                    <Grid.Row>
                        <Grid.Col width={12} sm={12} md={8} lg={8}>
                            <Card title="Lista dei laboratori" isCollapsible={true} isCollapsed={window.innerWidth < 400} className="w-100">
                                <Card.Body>
                                {avabile_labs.map((lab, index) => <LabShow key={index} title={lab.title} description={lab.description} />)}
                                </Card.Body>
                            </Card>
                        </Grid.Col>
                        <Grid.Col width={12} sm={12} md={8} lg={4}>
                            <Grid.Row>
                                <Grid.Col width={12}>
                                    <Card className="text-center bg-primary text-white">
                                        <h4 className="my-4">{profile.name + ' ' + profile.surname + ' - ' + profile.classLabel}</h4>
                                    </Card>
                                </Grid.Col>
                                <Grid.Col width={12}>
                                    <Card title="Scegli i laboratori">
                                        <Card.Body>
                                            <u className="d-block mb-4" style={{ fontSize: '0.9em' }}>Per i progetti da <b>due ore</b> seleziona la prima e la seconda ora o la terza e la quarta ora.</u>
                                            <LabsSelectorForm labs={avabile_labs} />
                                        </Card.Body>
                                    </Card>
                                </Grid.Col>
                            </Grid.Row>
                        </Grid.Col>
                    </Grid.Row>
                </Page.Content>
            </SiteWrapper>
        );

        // return (
        //     <>
        //         <Container className="std-page pt-4">
        //             {error.labs ? <ErrorAlert message={error.labs}/> : ''}
        //             <Row>
        //                 <Col>
        //                     <Card className="text-center shadow-sm">
        //                         <CardBody>
        //                             <Badge student={profile} />
        //                             <Row className="mb-2">
        //                                 <Col>
        //                                     <CardTitle className="display-4">Laboratori</CardTitle>
        //                                 </Col>
        //                             </Row>
        //                             <Row className="mb-2 px-2">
        //                                 <Col className="text-center">
        //                                     <Button color="link" onClick={this.toggleLabList} style={{ marginBottom: '1rem' }}>
        //                                         {(this.state.collapse ? 'Nascondi' : 'Mostra') + ' la lista dei laboratori' }
        //                                     </Button>
        //                                     <Collapse isOpen={this.state.collapse}>
        //                                         {avabile_labs.map((lab, index) => <LabShow key={index} title={lab.title} description={lab.description} />)}
        //                                         <p className="text-uppercase" style={{ fontSize: '0.7em', color: '#c9c9c9' }}>- Informazioni gentilmente offerte dai Rappresentanti d'Istituto -</p>
        //                                     </Collapse>
        //                                 </Col>
        //                             </Row>
        //                             <Row className="mb-3">
        //                                 <Col className="text-uppercase">
        //                                     <u style={{ fontSize: '0.9em' }}>Per i progetti da <b>due ore</b> seleziona la prima e la seconda ora o la terza e la quarta ora.</u>
        //                                 </Col>
        //                             </Row>
        //                             <LabsSelectorForm labs={avabile_labs} />
        //                         </CardBody>
        //                     </Card>
        //                 </Col>
        //             </Row>
        //         </Container>
        //         <Footer />
        //     </>
        // );
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