import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, CardHeader } from 'reactstrap';

const ListCard = ({ title, items, buttons }) => (
	<Col xs="12" md="4">
		<Card>
			<CardHeader>
				<b>{title}</b>
			</CardHeader>
			<CardBody>
				<Fragment>
					<ul className="list-unstyled">
						{items.map((item, index) => (
							<li key={index}>
								<Row className="align-items-center">
									<Col xs={item.colSize || '3'}>
										{item.title}
									</Col>
									<Col>{item.text}</Col>
								</Row>
							</li>
						))}
					</ul>
					{buttons}
				</Fragment>
			</CardBody>
		</Card>
	</Col>
);

ListCard.propTypes = {
	title: PropTypes.string.isRequired,
	items: PropTypes.array.isRequired,
	buttons: PropTypes.any
};

export default ListCard;
