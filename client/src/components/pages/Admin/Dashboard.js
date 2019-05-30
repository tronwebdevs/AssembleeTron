import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Page,
    Grid,
    Card,
    Table,
    Button,
    StampCard,
    Badge,
} from "tabler-react";
import SiteWrapper from '../../Admin/SiteWrapper/';

class Dashboard extends Component {
    render() {
        return (
            <SiteWrapper>
                <Page.Content title="Dashboard">
                    <Grid.Row cards={true}>
                        <Grid.Col width={12} md={4}>
                            <StampCard
                                color="blue"
                                icon="list"
                                header={
                                    <Link to="/gestore/laboratori">
                                        30 <small>Laboratori</small>
                                    </Link>
                                }
                            />
                        </Grid.Col>
                        <Grid.Col width={12} md={4}>
                            <StampCard
                                color="green"
                                icon="users"
                                header={
                                    <Link to="/gestore/studenti">
                                        621 <small>Partecipanti</small>
                                    </Link>
                                }
                            />
                        </Grid.Col>
                        <Grid.Col width={12} md={4}>
                            <StampCard
                                color="red"
                                icon="users"
                                header={
                                    <Link to="/gestore/studenti">
                                        1,562 <small>Studenti</small>
                                    </Link>
                                }
                            />
                        </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Col width={12} md={4}>
                            <Card title="Informazioni">
                                <Card.Body>
                                    <ul className="list-unstyled">
                                        <li>
                                            <Grid.Row className="align-items-center">
                                                <Grid.Col sm={3} md={3} lg={3}>Nome</Grid.Col>
                                                <Grid.Col auto>Assemblea di Natale</Grid.Col>
                                            </Grid.Row>
                                        </li>
                                        <li>
                                            <Grid.Row className="align-items-center">
                                                <Grid.Col sm={3} md={3} lg={3}>Data</Grid.Col>
                                                <Grid.Col auto>
                                                    18/05/2019 {"  "}
                                                    <small className="text-muted">(-5 giorni)</small>
                                                </Grid.Col>
                                            </Grid.Row>
                                        </li>
                                    </ul>
                                </Card.Body>
                                <Card.Footer>
                                    <Button.List align="center">
                                        <Link 
                                            to="/gestore/informazioni"
                                            className="btn btn-info"
                                        >
                                            Vedi
                                        </Link>
                                        <Link
                                            to="/gestore/informazioni?modifica" 
                                            className="btn btn-secondary"
                                        >
                                            Modifica
                                        </Link>
                                    </Button.List>
                                </Card.Footer>
                            </Card>
                        </Grid.Col>
                        <Grid.Col width={12} md={4}>
                            <Card title="Empty">
                                <Card.Body className="text-muted">Empty</Card.Body>
                            </Card>
                        </Grid.Col>
                        <Grid.Col width={12} md={4}>
                            <Card title="Stato del sistema">
                                <Table cards>
                                    <Table.Row>
                                        <Table.Col>Errori</Table.Col>
                                        <Table.Col alignContent="right">
                                            <Badge color="danger">0</Badge>
                                        </Table.Col>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Col>Avvertimenti</Table.Col>
                                        <Table.Col alignContent="right">
                                            <Badge color="warning">0</Badge>
                                        </Table.Col>
                                    </Table.Row>
                                </Table>
                            </Card>
                        </Grid.Col>
                    </Grid.Row>
                </Page.Content>
            </SiteWrapper>
        )
    }
}

Dashboard.propTypes = {
    admin: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    admin: state.admin
});

export default connect(mapStateToProps)(Dashboard);
