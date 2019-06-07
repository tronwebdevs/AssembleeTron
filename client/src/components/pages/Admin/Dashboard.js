import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyGeneral } from '../../../actions/assemblyActions';
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
import moment from 'moment';
import SiteWrapper from '../../Admin/SiteWrapper/';
import SmallCard from '../../Admin/Dashboard/SmallCard';

const Dashboard = ({
    assembly,
    admin,
    fetchAssemblyGeneral
}) => {
    const { stats, info, fetch_pending } = assembly;
    const { admin_dashboard } = fetch_pending;
    if (admin_dashboard !== false && admin_dashboard !== true) {
        fetchAssemblyGeneral();
    }

    const displayDaysLeft = days => {
        if (days < 0) {
            return Math.abs(days) + ' giorni fa';
        } else if (days === 0) {
            return 'Oggi';
        } else {
            return '-' + days + ' giorni';
        }
    }

    const cards = [
        {
            color: 'blue',
            icon: 'list',
            link: '/gestore/laboratori',
            title: stats.labs,
            subtitle: 'Laboratori'
        },
        {
            color: 'green',
            icon: 'users',
            link: '/gestore/studenti',
            title: stats.subs,
            subtitle: 'Partecipanti'
        },
        {
            color: 'red',
            icon: 'users',
            link: '/gestore/studenti',
            title: stats.students,
            subtitle: 'Studenti'
        },
    ];

    return (
        <SiteWrapper>
            <Page.Content title="Dashboard">
                <Grid.Row cards={true}>
                    {cards.map(card => <SmallCard {...card} />)}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12} md={4}>
                        <Card title="Informazioni">
                            <Card.Body>
                                <ul className="list-unstyled">
                                    <li>
                                        <Grid.Row className="align-items-center">
                                            <Grid.Col sm={3} md={3} lg={3}>Nome</Grid.Col>
                                            <Grid.Col auto>{info.name || 'Assemblea Senza Nome'}</Grid.Col>
                                        </Grid.Row>
                                    </li>
                                    <li>
                                        <Grid.Row className="align-items-center">
                                            <Grid.Col sm={3} md={3} lg={3}>Data</Grid.Col>
                                            <Grid.Col auto>
                                                {moment(info.date).format('DD/MM/YYYY')} {"  "}
                                                <small className="text-muted">({displayDaysLeft(moment(info.date).diff(moment(), 'days'))})</small>
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
    );
};

Dashboard.propTypes = {
    admin: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    admin: state.admin,
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyGeneral })(Dashboard);
