import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Card, Badge } from "tabler-react";
import moment from 'moment';
import DashInfoCard from './DashInfoCard';

const DashAssemblyRow = ({ info }) => {
    const displayDaysLeft = days => {
        if (days < 0) {
            return Math.abs(days) + ' giorni fa';
        } else if (days === 0) {
            return 'Oggi';
        } else {
            return '-' + days + ' giorni';
        }
    }

    return (
        <Grid.Row cards={true}>
            <DashInfoCard 
                title="Informazioni"
                listItems={[
                    {
                        title: "Nome",
                        text: info.title || "Assemblea Senza Nome"
                    },
                    {
                        title: "Data",
                        text: (
                            <React.Fragment>
                                {moment(info.date).format('DD/MM/YYYY')}
                                <small className="text-muted">({displayDaysLeft(moment(info.date).diff(moment(), 'days'))})</small>
                            </React.Fragment>
                        )
                    },
                ]}
                button={(
                    <Link
                        to="/gestore/informazioni"
                        className="btn btn-block btn-outline-primary"
                    >
                        Vedi
                    </Link>
                )}
            />
            <DashInfoCard
                title="Isctizioni"
                listItems={[
                    {
                        title: "Stato",
                        text: (
                            moment(info.subOpen).diff(moment()) < 0 && moment(info.subClose).diff(moment()) > 0 ?
                            <Badge color="success">Aperte</Badge> :
                            <Badge color="danger">Chiuse</Badge>
                        )
                    },
                    {
                        title: "Apertura",
                        text: moment(info.subOpen).format('HH:mm DD/MM/YYYY')
                    },
                    {
                        title: "Chiusura",
                        text: moment(info.subClose).format('HH:mm DD/MM/YYYY')
                    },
                ]}
            />
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
    );
};

DashAssemblyRow.propTypes = {
    info: PropTypes.object.isRequired
};

export default DashAssemblyRow;