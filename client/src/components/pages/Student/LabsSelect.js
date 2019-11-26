import React, { useState } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Card, CardHeader, CardBody, Alert } from "reactstrap";

import {
	Badge,
	LabsSelectorForm,
	PageTitle,
	SiteWrapper,
	LabsListCard
} from "../../Student/";

const LabsSelect = ({ student }) => {
	const { profile, labs, labs_avabile } = student;

	const [globalError, setGlobalError] = useState(null);

	if (profile.studentId === null) {
		return <Redirect to={{ pathname: "/" }} />;
	} else if (labs.length > 0) {
		return <Redirect to={{ pathname: "/conferma" }} />;
	}

	return (
		<SiteWrapper>
			<Row>
				<PageTitle title="Laboratori" />
			</Row>
			<Row>
				<Col xs="12" lg="8">
					{window.innerWidth <= 999 ? (
						<Row>
							<Badge student={profile} />
						</Row>
					) : null}
					<LabsListCard labs={labs_avabile} />
				</Col>
				<Col xs="12" lg="4">
					<div style={{ position: "sticky", top: "1.5rem" }}>
						<Row>
							{window.innerWidth > 999 ? (
								<Badge student={profile} />
							) : null}
							<Col>
								<Card>
									<CardHeader>
										<b>Scegli i laboratori</b>
									</CardHeader>
									{globalError ? (
										<Alert
											color="danger"
											style={{ borderRadius: "0" }}
										>
											Errore: {globalError}
										</Alert>
									) : (
										""
									)}
									<CardBody>
										<u
											className="d-block mb-4"
											style={{ fontSize: "0.9em" }}
										>
											Per i progetti da <b>due ore</b>{" "}
											seleziona la prima e la seconda ora
											o la terza e la quarta ora.
										</u>
										<LabsSelectorForm
											labs={labs_avabile}
											setGlobalError={msg =>
												setGlobalError(msg)
											}
										/>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</SiteWrapper>
	);
};

LabsSelect.propTypes = {
	student: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	student: state.student
});

export default connect(mapStateToProps)(LabsSelect);
