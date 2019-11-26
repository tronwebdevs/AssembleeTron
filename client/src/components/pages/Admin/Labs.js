import React, { useState } from "react";
import { connect } from "react-redux";
import { deleteAssemblyLab } from "../../../actions/assemblyActions";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Button, Alert } from "reactstrap";
import { SiteWrapper, LabsTable, LabModal, PageLoading } from "../../Admin/";

const Labs = ({ assembly, deleteAssemblyLab }) => {
	const { labs, pendings } = assembly;

	const [displayMessage, setDisplayMessage] = useState({
		type: null,
		message: null
	});
	const [labDisplay, setLabDisplay] = useState({
		action: "create",
		lab: {}
	});
	const [showModal, setShowModal] = useState(false);

	return (
		<SiteWrapper title="Laboratori">
			<Row>
				{displayMessage.message ? (
					<Col xs="12">
						<Alert color={displayMessage.type}>
							{displayMessage.message}
						</Alert>
					</Col>
				) : null}
			</Row>
			{pendings.assembly === false ? (
				<React.Fragment>
					<Row>
						<Col xs="12" xl={assembly.exists ? "9" : "12"}>
							<Card>
								<LabsTable
									labs={labs}
									setLabDisplay={setLabDisplay}
									deleteAssemblyLab={deleteAssemblyLab}
									setDisplayMessage={setDisplayMessage}
									setShowModal={setShowModal}
								/>
							</Card>
						</Col>
						{assembly.exists ? (
							<Col xs="12" xl="3">
								<Card>
									<CardBody>
										<Button
											type="button"
											color="success"
											block
											onClick={() => setShowModal(true)}
										>
											Crea
										</Button>
										<Button
											color="warning"
											outline
											block
											onClick={() =>
												alert("Not implemented yet")
											}
										>
											Controlla
										</Button>
									</CardBody>
								</Card>
							</Col>
						) : null}
					</Row>
					<LabModal
						showModal={showModal}
						handleClose={() => setShowModal(false)}
						lab={labDisplay.lab}
						action={labDisplay.action}
						handleReset={() =>
							setLabDisplay({ action: "create", lab: {} })
						}
						setDisplayMessage={setDisplayMessage}
						setLabDisplay={setLabDisplay}
					/>
				</React.Fragment>
			) : (
				<PageLoading />
			)}
		</SiteWrapper>
	);
};

Labs.propTypes = {
	assembly: PropTypes.object.isRequired,
	deleteAssemblyLab: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { deleteAssemblyLab })(Labs);
