import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
	createAssemblyInfo,
	loadAssembly
} from "../../../actions/assemblyActions";
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Button,
	UncontrolledAlert
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import { InfoForm, ImportAssemblyCard } from "../../Admin/";
import { validateInfoForm } from "../../../utils/";
import moment from "moment";

const CreateAssembly = ({
	admin,
	assembly,
	createAssemblyInfo,
	loadAssembly
}) => {
	const [displayMessage, setDisplayMessage] = useState({
		type: null,
		message: null
	});

	const authToken = admin.token;
	const { exists, pendings, info, stats } = assembly;

	if (
		pendings.create_info === false &&
		exists === true &&
		displayMessage.message === null
	) {
		return <Redirect to={{ pathname: "/gestore/laboratori" }} />;
	} else if (exists === true) {
		return <Redirect to={{ pathname: "/gestore/" }} />;
	}

	return (
		<Fragment>
			<Row>
				{displayMessage.message ? (
					<Col xs="12">
						<UncontrolledAlert color={displayMessage.type}>
							{displayMessage.message}
						</UncontrolledAlert>
					</Col>
				) : null}
			</Row>
			<Row>
				<Col xs="12">
					<Card>
						<CardHeader>
							<b>Informazioni</b>
						</CardHeader>
						<CardBody>
							<InfoForm
								info={{
									title: "",
									date: moment().startOf("year"),
									subscription: {
										open: moment().startOf("year"),
										close: moment().startOf("year")
									},
									sections: []
								}}
								onSubmit={(
                                    values,
                                    { setSubmitting, setErrors }
                                ) => {
									if (pendings.create_info === undefined) {
										const errors = validateInfoForm(
                                            values, 
                                            info.sections, 
                                            stats.labs,
                                            false
                                        );

										if (Object.entries(errors).length === 0) {
											createAssemblyInfo({
												...values,
                                                subOpen: moment(
                                                    values.subOpenDate + " " + 
                                                    values.subOpenTime
                                                ).format(),
                                                subClose: moment(
                                                    values.subCloseDate + " " + 
                                                    values.subCloseTime
                                                ).format(),
                                                sections: values.sections.map(
                                                    ({ value }) => value
                                                )
											})
												.then(() =>
													setSubmitting(false)
												)
												.catch(({ message }) => {
													setSubmitting(false);
													setDisplayMessage({
														type: "danger",
														message
													});
												});
										} else {
											setSubmitting(false);
											setErrors(errors);
										}
									}
								}}
								buttons={[
									<Link
										className="btn btn-block btn-outline-danger"
										to="/gestore/"
									>
										Annulla
									</Link>,
									<Button type="submit" block color="primary">
										Continua
									</Button>
								]}
								setError={message =>
									setDisplayMessage({
										type: "danger",
										message
									})
								}
								authToken={authToken}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col xs="12">
					<ImportAssemblyCard
						authToken={authToken}
						setError={message =>
							setDisplayMessage({
								type: "danger",
								message
							})
						}
						loadAssembly={loadAssembly}
						isSubmitting={pendings.load === true}
					/>
				</Col>
			</Row>
		</Fragment>
	);
};

CreateAssembly.propTypes = {
	assembly: PropTypes.object.isRequired,
	admin: PropTypes.object.isRequired,
	createAssemblyInfo: PropTypes.func.isRequired,
	loadAssembly: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly,
	admin: state.admin
});

export default connect(mapStateToProps, { createAssemblyInfo, loadAssembly })(
	CreateAssembly
);
