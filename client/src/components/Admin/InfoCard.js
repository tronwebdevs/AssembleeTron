import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import moment from "moment";
import Selector from "../Admin/LabForm/LabHour/Selector";

const InfoCard = ({ info, edit }) => (
	<Fragment>
		<Row>
			<Col xs="12" lg="4">
				<FormGroup>
					<Label className="form-label">Titolo</Label>
					<Input
						type="text"
						value={info.title}
						className="mb-2"
						disabled
					/>
				</FormGroup>
				<FormGroup>
					<Label>Identificativo</Label>
					<Input type="text" value={info._id} disabled />
				</FormGroup>
			</Col>
			<Col xs="12" lg="4">
				<FormGroup>
					<Label className="form-label">Data</Label>
					<Input
						type="date"
						value={moment(info.date).format("YYYY-MM-DD")}
						className="mb-2"
						disabled
					/>
				</FormGroup>
			</Col>
			<Col xs="12" lg="4">
				<FormGroup>
					<Label className="form-label">Apertura iscrizioni</Label>
					<Row className="mb-2">
						<Col xs="12" lg="7">
							<Input
								type="date"
								value={moment(info.subscription.open).format(
									"YYYY-MM-DD"
								)}
								disabled
							/>
						</Col>
						<Col xs="12" lg="5">
							<Input
								type="time"
								value={moment(info.subscription.open).format(
									"HH:mm"
								)}
								disabled
							/>
						</Col>
					</Row>
				</FormGroup>
				<FormGroup>
					<Label className="form-label">Chiusura iscrizioni</Label>
					<Row className="mb-2">
						<Col xs="12" lg="7">
							<Input
								type="date"
								value={moment(info.subscription.close).format(
									"YYYY-MM-DD"
								)}
								disabled
							/>
						</Col>
						<Col xs="12" lg="5">
							<Input
								type="time"
								value={moment(info.subscription.close).format(
									"HH:mm"
								)}
								disabled
							/>
						</Col>
					</Row>
				</FormGroup>
			</Col>
		</Row>
		<Row>
			<Col>
				<FormGroup>
					<Label className="form-label">Classi partecipanti</Label>
					<Selector
						name={"sections"}
						value={info.sections.map(c => ({ label: c, value: c }))}
						classes={info.sections}
						setValue={() => ({})}
						isDisabled={true}
					/>
				</FormGroup>
			</Col>
		</Row>
		<Row className="mt-4">
			<Col md={{ size: "2", offset: "5" }}>
				<Button block color="primary" onClick={edit}>
					Modifica
				</Button>
			</Col>
		</Row>
	</Fragment>
);

InfoCard.propTypes = {
	info: PropTypes.object.isRequired,
	edit: PropTypes.func.isRequired
};

export default InfoCard;
