import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import {
	deleteAssemblyLab,
	fetchAllLabs
} from "../../../actions/assemblyActions";
import PropTypes from "prop-types";
import {
	Row,
	Col,
	Card,
	CardBody,
	Button
} from "reactstrap";
import { LabsTable, LabModal, PageLoading, AdminAlert } from "../../Admin/";

const Labs = ({ assembly, deleteAssemblyLab, fetchAllLabs }) => {
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

	if (pendings.labs === undefined && assembly.exists === true) {
		fetchAllLabs();
    }
    
    let isPageLoading = true;
    if (pendings.assembly === false) {
        if (assembly.exists === true) {
            if (pendings.labs === false) {
                isPageLoading = false;
            }
        } else {
            isPageLoading = false;
        }
    } else {
        isPageLoading = false;
    }

	return (
		<Fragment>
            <AdminAlert 
                display={displayMessage.message !== null} 
                message={displayMessage.message} 
                type={displayMessage.type}
            />
            {isPageLoading === false ? (
				<Fragment>
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
												alert("Funzione in arrivo")
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
				</Fragment>
			) : (
				<PageLoading />
			)}
		</Fragment>
	);
};

Labs.propTypes = {
	assembly: PropTypes.object.isRequired,
	deleteAssemblyLab: PropTypes.func.isRequired,
	fetchAllLabs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { deleteAssemblyLab, fetchAllLabs })(
	Labs
);
