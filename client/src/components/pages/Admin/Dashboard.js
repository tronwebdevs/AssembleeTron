import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	UncontrolledAlert
} from "reactstrap";
import {
	SiteWrapper,
	SmallCard,
	DashAssemblyRow,
	PageLoading
} from "../../Admin/";

const Dashboard = ({ assembly, errorMessage }) => {
	const { stats, info, pendings } = assembly;

	const cards = [
		{
			color: "blue",
			icon: "list",
			link: "/gestore/laboratori",
			title: stats.labs.toString(),
			subtitle: "Laboratori"
		},
		{
			color: "green",
			icon: "users",
			link: "/gestore/studenti",
			title: stats.subs.toString(),
			subtitle: "Partecipanti"
		},
		{
			color: "red",
			icon: "users",
			link: "/gestore/studenti",
			title: stats.students.toString(),
			subtitle: "Studenti"
		}
	];

	const renderAssemblyInfo = () =>
		assembly.exists === true ? (
			<DashAssemblyRow info={info} />
		) : (
			<Row>
				<Col xs="12">
					<Card>
						<CardHeader>
							<b>Nessuna assemblea esistente</b>
						</CardHeader>
						<CardBody>
							<p>
								Nessuna assemblea trovata sul database, procedi
								per crearne una nuova
							</p>
							<span className="mr-3">
								<Link
									to="/gestore/crea"
									className="btn btn-outline-success"
								>
									Crea nuova assemblea
								</Link>
							</span>
						</CardBody>
					</Card>
				</Col>
			</Row>
		);

	const assemblyLoadedAlert = loaded =>
		loaded ? (
			<Row>
				<Col xs="12">
					<UncontrolledAlert color="success">
						Assemblea caricata con successo
					</UncontrolledAlert>
				</Col>
			</Row>
		) : null;
	return (
		<SiteWrapper title="Dashboard">
			{errorMessage ? (
				<Row>
					<Col xs="12">
						<UncontrolledAlert color="danger">
							{errorMessage}
						</UncontrolledAlert>
					</Col>
				</Row>
			) : null}
			{assemblyLoadedAlert(pendings.load === false)}
			{pendings.assembly === false ? (
				<React.Fragment>
					<Row>
						{cards.map((card, index) => (
							<SmallCard key={index} {...card} />
						))}
					</Row>
					{renderAssemblyInfo()}
					<Row>
						<Col xs="12">
							<Card>
								<CardHeader>
									<b>Istruzioni</b>
								</CardHeader>
								<CardBody>
									<span className="d-block mb-1">
										Per creare una nuova assemblea seguire i
										seguenti passaggi:
									</span>
									<ol>
										<li>
											Eliminare l'asssemblea esistente (se
											presente)
										</li>
										<li>
											Creare la nuova assemblea inserendo
											titolo, data, apertura e chuisura
											delle iscrizioni, classi
											partecipanti all'assemblea
										</li>
										<li>Inserire i laboratori</li>
									</ol>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</React.Fragment>
			) : (
				<PageLoading />
			)}
		</SiteWrapper>
	);
};

Dashboard.propTypes = {
	assembly: PropTypes.object.isRequired,
	errorMessage: PropTypes.string
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps)(Dashboard);
