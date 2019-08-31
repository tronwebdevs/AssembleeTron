import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Grid, Card, Alert } from "tabler-react";
import { SiteWrapper, SmallCard, DashAssemblyRow } from '../../Admin/';

const Dashboard = ({ assembly, errorMessage }) => {

    const { stats, info, pendings } = assembly;

    const cards = [
        {
            color: 'blue',
            icon: 'list',
            link: '/gestore/laboratori',
            title: stats.labs.toString(),
            subtitle: 'Laboratori'
        },
        {
            color: 'green',
            icon: 'users',
            link: '/gestore/studenti',
            title: stats.subs.toString(),
            subtitle: 'Partecipanti'
        },
        {
            color: 'red',
            icon: 'users',
            link: '/gestore/studenti',
            title: stats.students.toString(),
            subtitle: 'Studenti'
        },
    ];

    const renderAssemblyInfo = () => assembly.exists === true ? (
        <DashAssemblyRow info={info}/>
    ) : (
        <Grid.Row>
            <Grid.Col width={12}>
                <Card title="Nessuna assemblea esistente">
                    <Card.Body>
                        <p>Nessuna assemblea trovata sul database, procedi per crearne una nuova</p>
                        <span className="mr-3">
                            <Link to="/gestore/crea" className="btn btn-outline-success">
                                Crea nuova assemblea
                            </Link>
                        </span>
                    </Card.Body>
                </Card>
            </Grid.Col>
        </Grid.Row>
    );

    return (
        <SiteWrapper>
            <Page.Content title="Dashboard">
                {errorMessage ? (
                    <Grid.Row>
                        <Grid.Col width={12}>
                            <Alert type="danger">{errorMessage}</Alert>
                        </Grid.Col>
                    </Grid.Row>
                ) : null}
                <Grid.Row cards={true}>
                    {cards.map((card, index) => <SmallCard key={index} {...card} />)}
                </Grid.Row>
                {pendings.assembly === false ? renderAssemblyInfo() : null}
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

export default connect(mapStateToProps)(Dashboard);
