import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { AssemblyInfo, CardsRow, PageLoading } from '../../Admin/';
import cogoToast from 'cogo-toast';

const Dashboard = ({ assembly }) => {
    const { stats, info, pendings } = assembly;
    
    let text = null;
    if (pendings.load === false) {
        text = 'caricata';
    } else if (pendings.create_info === false) {
        text = 'creata';
    } else if (pendings.delete_assembly === false) {
        text = 'eliminata';
    }
    if (text !== null) {
        cogoToast.success(`Assemblea ${text} con successo`)
    }
	let cards = [];

	if (pendings.assembly === false) {
		cards = [
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
			}
		];
		return (
			<Fragment>
				<CardsRow cards={cards} />
				<AssemblyInfo exists={assembly.exists} info={info} />
				<Row>
					<Col xs="12" md="8">
						<Card>
							<CardHeader>
								<b>Nuova assemblea</b>
							</CardHeader>
							<CardBody>
								<span className="d-block mb-1">
									Per creare una nuova assemblea seguire i
									seguenti passaggi:
								</span>
								<ol style={{ paddingLeft: 30 }}>
									<li>
										Eliminare l'asssemblea esistente (se
										presente) attraverso il bottone presente
										in questa pagina
									</li>
									<li>
										Creare la nuova assemblea inserendo
										titolo, data, apertura e chuisura delle
										iscrizioni, classi partecipanti
										all'assemblea (senza includere le classi
										impegnate con gite o uscite e che non
										potranno quindi partecipare
										all'assemblea)
									</li>
									<li>
										Inserire i laboratori, tenendo conto che
										tutte le classi dovranno potersi
										iscrivere ad almeno un laboratorio per
										fascia
									</li>
								</ol>
							</CardBody>
						</Card>
					</Col>
					<Col xs="12" md="4">
						<Card>
							<CardHeader>
								<b>Inserire nuovi studenti</b>
							</CardHeader>
							<CardBody>
								<span className="d-block mb-1">
									Per inserire nuovi studenti è sufficiente
									andare nella
									<Link to="/gestore/studenti">
										{' '}
										sezione studenti{' '}
									</Link>
									e utilizzare l'apposito bottone
								</span>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Fragment>
		);
	} else {
		return <PageLoading />;
	}
};

Dashboard.propTypes = {
	assembly: PropTypes.object.isRequired,
	errorMessage: PropTypes.string
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps)(Dashboard);
