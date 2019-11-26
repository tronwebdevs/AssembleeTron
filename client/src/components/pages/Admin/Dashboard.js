import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardBody, Alert } from "reactstrap";
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

	return (
		<SiteWrapper title="Dashboard">
			{errorMessage ? (
				<Row>
					<Col xs="12">
						<Alert color="danger">{errorMessage}</Alert>
					</Col>
				</Row>
			) : null}
			{pendings.assembly === false ? (
				<React.Fragment>
					<Row>
						{cards.map((card, index) => (
							<SmallCard key={index} {...card} />
						))}
					</Row>
					{renderAssemblyInfo()}
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
