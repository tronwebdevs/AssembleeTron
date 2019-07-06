import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyGeneral } from '../../../actions/assemblyActions';
import { Link } from 'react-router-dom';
import { Page, Grid, Card, Badge } from "tabler-react";
import moment from 'moment';
import SiteWrapper from '../../Admin/SiteWrapper/';
import SmallCard from '../../Admin/Dashboard/SmallCard';
import { Spinner } from "reactstrap";

const Dashboard = ({
    assembly,
    fetchAssemblyGeneral
}) => {
    const { stats, info, fetch_pending } = assembly;
    const { admin_dashboard } = fetch_pending;
    if (admin_dashboard === undefined) {
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

    const renderSubState = () => {
        if (moment(info.subOpen).diff(moment()) < 0 && moment(info.subClose).diff(moment()) > 0) {
            return (
                <Badge color="success">Aperte</Badge>
            );
        } else {
            return (
                <Badge color="danger">Chiuse</Badge>
            );
        }
    }

    const renderOnFetchDone = component => admin_dashboard === false ? component : (
        <div className="text-center">
            <Spinner color="primary" style={{ width: '4rem', height: '4rem' }}/>
        </div>
    );

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
                                {renderOnFetchDone(
                                    <React.Fragment>
                                        <ul className="list-unstyled">
                                            <li>
                                                <Grid.Row className="align-items-center">
                                                    <Grid.Col sm={3} md={3} lg={3}>Nome</Grid.Col>
                                                    <Grid.Col auto>{info.title || 'Assemblea Senza Nome'}</Grid.Col>
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
                                        <Link
                                            to="/gestore/informazioni"
                                            className="btn btn-block btn-outline-primary"
                                        >
                                            Vedi
                                        </Link>
                                    </React.Fragment>
                                )}
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                    <Grid.Col width={12} md={4}>
                        <Card title="Isctizioni">
                            <Card.Body>
                                {renderOnFetchDone(
                                    <ul className="list-unstyled">
                                        <li>
                                            <Grid.Row className="align-items-center">
                                                <Grid.Col sm={3} md={3} lg={3}>Stato</Grid.Col>
                                                <Grid.Col auto>
                                                    {renderSubState()}
                                                </Grid.Col>
                                            </Grid.Row>
                                        </li>
                                        <li>
                                            <Grid.Row className="align-items-center">
                                                <Grid.Col sm={3} md={3} lg={3}>Apertura</Grid.Col>
                                                <Grid.Col auto>{moment(info.subOpen).format('HH:mm DD/MM/YYYY')}</Grid.Col>
                                            </Grid.Row>
                                        </li>
                                        <li>
                                            <Grid.Row className="align-items-center">
                                                <Grid.Col sm={3} md={3} lg={3}>Chiusura</Grid.Col>
                                                <Grid.Col auto>{moment(info.subClose).format('HH:mm DD/MM/YYYY')}</Grid.Col>
                                            </Grid.Row>
                                        </li>
                                    </ul>
                                )}
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                    <Grid.Col width={12} md={4}>
                        <Card title="Elimina assemblea">
                            <Card.Body>
                                <p>Rimuovi tutti i laboratori ed elimina l'assemblea</p>
                                <Link
                                    to="/gestore/elimina"
                                    className="btn btn-block btn-outline-danger"
                                >
                                    Elimina
                                </Link>
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
};

Dashboard.propTypes = {
    assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyGeneral })(Dashboard);
