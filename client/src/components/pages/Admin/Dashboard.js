import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssemblyGeneral } from '../../../actions/assemblyActions';
import { Page, Grid, Card, Button } from "tabler-react";
import SiteWrapper from '../../Admin/SiteWrapper/';
import SmallCard from '../../Admin/Dashboard/SmallCard';
import DashAssemblyRow from '../../Admin/DashAssemblyRow';

const Dashboard = ({
    assembly,
    fetchAssemblyGeneral
}) => {

    const { stats, info, fetch_pending } = assembly;
    const { admin_dashboard } = fetch_pending;

    if (admin_dashboard === undefined) {
        fetchAssemblyGeneral();
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

    const renderAssemblyInfo = () => assembly.exists === true ? (
        <DashAssemblyRow info={info}/>
    ) : (
        <Grid.Row>
            <Grid.Col width={12}>
                <Card title="Nessuna assemblea esistente">
                    <Card.Body>
                        <p>Nessuna assemblea trovata sul database, procedi per crearne una nuova</p>
                        <span className="mr-3">
                            <Button color="outline-success">Crea nuova assemblea</Button>
                        </span>
                        <Button color="outline-info">Crea assemblea da template</Button>
                    </Card.Body>
                </Card>
            </Grid.Col>
        </Grid.Row>
    );

    return (
        <SiteWrapper>
            <Page.Content title="Dashboard">
                <Grid.Row cards={true}>
                    {cards.map(card => <SmallCard {...card} />)}
                </Grid.Row>
                {admin_dashboard === false ? renderAssemblyInfo() : null}
            </Page.Content>
        </SiteWrapper>
    );
};

Dashboard.propTypes = {
    assembly: PropTypes.object.isRequired,
    fetchAssemblyGeneral: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyGeneral })(Dashboard);
