import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";

const DashInfoCard = ({ title, listItems, button }) => (
	<Col xs="12" md="4">
		<Card>
			<CardHeader>
				<b>{title}</b>
			</CardHeader>
			<CardBody>
				<Fragment>
					<ul className="list-unstyled">
						{listItems.map((item, index) => (
							<li key={index}>
								<Row className="align-items-center">
									<Col xs="3">{item.title}</Col>
									<Col>{item.text}</Col>
								</Row>
							</li>
						))}
					</ul>
					{button}
				</Fragment>
			</CardBody>
		</Card>
	</Col>
);

DashInfoCard.propTypes = {
	title: PropTypes.string.isRequired
};

export default DashInfoCard;
