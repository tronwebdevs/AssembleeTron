import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Alert, Button } from "reactstrap";
import { updateAssemblyInfo } from "../../../actions/assemblyActions";
import { SiteWrapper, InfoForm, InfoCard, PageLoading } from "../../Admin/";
import moment from "moment";

const Info = ({ assembly, admin, updateAssemblyInfo }) => {
	const { pendings, info } = assembly;

	const [edit, setEdit] = useState(false);
	const [displayMessage, setDisplayMessage] = useState({
		type: null,
		message: null
	});

	const renderInfo = info =>
		edit === true ? (
			<InfoForm
				info={info}
				onSubmit={(
					{
						_id,
						title,
						date,
						subOpenDate,
						subOpenTime,
						subCloseDate,
						subCloseTime,
						sections
					},
					{ setSubmitting, setErrors }
				) => {
					if (pendings.update_info !== true) {
						let errors = {};
						if (title === null || title.trim() === "") {
							errors.title = "Il titolo non puo' restare vuoto";
						}
						let dateMoment = moment(date);
						let subOpenMoment = moment(
							subOpenDate + " " + subOpenTime
						);
						let subCloseMoment = moment(
							subCloseDate + " " + subCloseTime
						);

						if (dateMoment.diff(moment()) < 0) {
							errors.date =
								"La data dell'assemblea non puo' essere passata";
						}

						if (subOpenMoment.diff(dateMoment) > 0) {
							errors.subOpenDate =
								"Le iscrizioni non possono aprire dopo la data dell'assemblea";
						}

						if (subCloseMoment.diff(dateMoment) > 0) {
							errors.subCloseDate =
								"Le iscrizioni non possono chiudere dopo la data dell'assemblea";
						} else if (subCloseMoment.diff(subOpenMoment) < 0) {
							errors.subCloseDate =
								"Le iscrizioni non possono chiudere prima di iniziare";
						}

						if (sections.length <= 0) {
							errors.sections =
								"Nessuna classe potrà partecipare all'assemblea";
						} else if (
							sections.length !== info.sections.length &&
							!sections.every(
								(value, index) => value === info.sections[index]
							) &&
							assembly.labs.length > 0
						) {
							errors.sections =
								"Non puoi modificare le classi che partecipano all'assemblea " +
								"dato che ci sono gia' dei laboratori associati ad essa. " +
								"Riprova dopo aver eliminato tutti i laboratori.";
						}

						if (Object.entries(errors).length === 0) {
							updateAssemblyInfo({
								_id,
								title,
								date,
								subOpen: subOpenMoment.format(),
								subClose: subCloseMoment.format(),
								sections: sections.map(({ value }) => value)
							})
								.then(message =>
									setDisplayMessage({
										type: "success",
										message
									})
								)
								.catch(({ message }) =>
									setDisplayMessage({
										type: "danger",
										message
									})
								)
								.finally(() => {
									setEdit(false);
									setSubmitting(false);
								});
						} else {
							setSubmitting(false);
							setErrors(errors);
						}
					}
				}}
				buttons={[
					<Button
						type="button"
						block
						onClick={() => {
							setEdit(false);
						}}
						outline
						color="danger"
					>
						Annulla
					</Button>,
					<Button
						type="submit"
						block
						color="primary"
						disabled={pendings.info === true}
					>
						Salva
					</Button>
				]}
				setError={message =>
					setDisplayMessage({
						type: "danger",
						message
					})
				}
				authToken={admin.token}
			/>
		) : (
			<InfoCard info={info} edit={() => setEdit(true)} />
		);

	const checkIfExists = info =>
		assembly.exists === false ? (
			<p>
				Devi creare un'assemblea prima di poter visualizzare le
				informazioni
			</p>
		) : (
			renderInfo(info)
		);

	return (
		<SiteWrapper title="Informazioni">
			<Row>
				{displayMessage.message ? (
					<Col xs="12">
						<Alert color={displayMessage.type}>
							{displayMessage.message}
						</Alert>
					</Col>
				) : (
					""
				)}
			</Row>
			{pendings.assembly === false ? (
				<Row>
					<Col xs="12">
						<Card>
							<CardBody>
								{pendings.assembly === false ||
								pendings.info === false
									? checkIfExists(info)
									: ""}
							</CardBody>
						</Card>
					</Col>
				</Row>
			) : (
				<PageLoading />
			)}
		</SiteWrapper>
	);
};

Info.propTypes = {
	assembly: PropTypes.object.isRequired,
	admin: PropTypes.object.isRequired,
	updateAssemblyInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly,
	admin: state.admin
});

export default connect(mapStateToProps, { updateAssemblyInfo })(Info);
