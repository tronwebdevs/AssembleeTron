import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, CardHeader, Badge } from "reactstrap";
import moment from "moment";
import DashInfoCard from "./DashInfoCard";

const DashAssemblyRow = ({ info }) => {
	const displayDaysLeft = days => {
		if (days < 0) {
			return Math.abs(days) + " giorni fa";
		} else if (days === 0) {
			return "Oggi";
		} else {
			return "-" + days + " giorni";
		}
	};

	return (
		<Fragment>
			<Row>
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
								<Fragment>
									{moment(info.date).format("DD/MM/YYYY")}
									<small className="text-muted">
										{" "}
										(
										{displayDaysLeft(
											moment(info.date).diff(
												moment(),
												"days"
											)
										)}
										)
									</small>
								</Fragment>
							)
						}
					]}
					button={
						<Link
							to="/gestore/informazioni"
							className="btn btn-block btn-outline-primary"
						>
							Vedi
						</Link>
					}
				/>
				<DashInfoCard
					title="Iscrizioni"
					listItems={[
						{
							title: "Stato",
							text:
								moment(info.subscription.open).diff(moment()) <
									0 &&
								moment(info.subscription.close).diff(moment()) >
									0 ? (
									<Badge color="success">Aperte</Badge>
								) : (
									<Badge color="danger">Chiuse</Badge>
								)
						},
						{
							title: "Apertura",
							text: moment(info.subscription.open).format(
								"HH:mm DD/MM/YYYY"
							)
						},
						{
							title: "Chiusura",
							text: moment(info.subscription.close).format(
								"HH:mm DD/MM/YYYY"
							)
						}
					]}
					button={
						<Link
							to="/gestore/statistiche"
							className="btn btn-block btn-outline-info"
						>
							Statistiche
						</Link>
					}
				/>
				<Col xs="12" md="4">
					<Card>
						<CardHeader>
							<b>Elimina assemblea</b>
						</CardHeader>
						<CardBody>
							<p>
								Rimuovi tutti i laboratori ed elimina
								l'assemblea
							</p>
							<Link
								to="/gestore/elimina"
								className="btn btn-block btn-outline-danger"
							>
								Elimina
							</Link>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

DashAssemblyRow.propTypes = {
	info: PropTypes.object.isRequired
};

export default DashAssemblyRow;
