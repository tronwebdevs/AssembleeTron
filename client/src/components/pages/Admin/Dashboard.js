import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
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
        
        if (this.props.admin.id === -1) {
            return <Redirect to={{ pathname: '/gestore/login' }} />;
        }

        return (
            <SiteWrapper>
                <Page.Content title="Dashboard">
                    <Grid.Row cards={true}>
                        <Grid.Col sm={6} lg={3}>
                            <StampCard
                                color="blue"
                                icon="list"
                                header={
                                    <a href="/gestore/laboratori">
                                        30 <small>Laboratori</small>
                                    </a>
                                }
                            />
                        </Grid.Col>
                        <Grid.Col sm={6} lg={3}>
                            <StampCard
                                color="green"
                                icon="users"
                                header={
                                    <a href="#">
                                        621 <small>Partecipanti</small>
                                    </a>
                                }
                            />
                        </Grid.Col>
                        <Grid.Col sm={6} lg={3}>
                            <StampCard
                                color="red"
                                icon="users"
                                header={
                                    <a href="/gestore/studenti">
                                        1,562 <small>Studenti</small>
                                    </a>
                                }
                            />
                        </Grid.Col>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Col sm={6} lg={4}>
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
                                        <Button
                                            color="info"
                                            RootComponent="a"
                                            href="/gestore/informazioni"
                                        >
                                            Vedi
                                        </Button>
                                        <Button
                                            color="secondary"
                                            RootComponent="a"
                                            href="/gestore/informazioni?modifica"
                                        >
                                            Modifica
                                        </Button>
                                    </Button.List>
                                </Card.Footer>
                            </Card>
                        </Grid.Col>
                        <Grid.Col sm={6} lg={4}>
                            <Card title="Empty">
                                <Card.Body className="text-muted">Empty</Card.Body>
                            </Card>
                        </Grid.Col>
                        <Grid.Col sm={6} lg={4}>
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
