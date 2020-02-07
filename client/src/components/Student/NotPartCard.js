import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

const NotPartCard = () => (
	<Row>
		<Col>
			<Card>
				<CardBody className="text-center font-weight-bold text-uppercase">
					<span className="text-danger">
						Non partecipi all'assemblea
					</span>
				</CardBody>
			</Card>
		</Col>
	</Row>
);

export default NotPartCard;
