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
        <React.Fragment>
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
                                    <small className="text-muted">{' '}({displayDaysLeft(moment(info.date).diff(moment(), 'days'))})</small>
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
                    title="Iscrizioni"
                    listItems={[
                        {
                            title: "Stato",
                            text: (
                                moment(info.subscription.open).diff(moment()) < 0 && moment(info.subscription.close).diff(moment()) > 0 ?
                                <Badge color="success">Aperte</Badge> :
                                <Badge color="danger">Chiuse</Badge>
                            )
                        },
                        {
                            title: "Apertura",
                            text: moment(info.subscription.open).format('HH:mm DD/MM/YYYY')
                        },
                        {
                            title: "Chiusura",
                            text: moment(info.subscription.close).format('HH:mm DD/MM/YYYY')
                        }
                    ]}
                    button={(
                        <Link
                            to="/gestore/statistiche"
                            className="btn btn-block btn-outline-info"
                        >
                            Statistiche
                        </Link>
                    )}
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
            <Grid.Row>
                <Grid.Col width={12}>
                    <Card title="Istruzioni">
                        <Card.Body>
                            <span>Per creare una nuova assemblea seguire i seguenti passaggi:</span>
                            <ol>
                                <li>Eliminare l'asssemblea esistente (se presente)</li>
                                <li>Creare la nuova assemblea inserendo titolo, data, apertura e chuisura delle iscrizioni, classi partecipanti all'assemblea</li>
                                <li>Inserire i laboratori</li>
                            </ol>
                        </Card.Body>
                    </Card>
                </Grid.Col>
            </Grid.Row>
        </React.Fragment>
    );
};

DashAssemblyRow.propTypes = {
    info: PropTypes.object.isRequired
};

export default DashAssemblyRow;