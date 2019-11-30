import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import DashAssemblyRow from "./DashAssemblyRow";

const AssemblyInfo = ({ exists, info }) =>
	exists === true ? (
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
							Nessuna assemblea trovata sul database, procedi per
							crearne una nuova
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
    
AssemblyInfo.propTypes = {
    exists: PropTypes.bool.isRequired,
    info: PropTypes.object
};

export default AssemblyInfo;
