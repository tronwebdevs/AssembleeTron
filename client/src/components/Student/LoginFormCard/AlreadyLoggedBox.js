import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { FaSignOutAlt } from 'react-icons/fa';

const AlreadyLoggedBox = ({ name, section }) => (
	<div style={{ backgroundColor: '#343434', padding: '1rem 1.5rem' }}>
		<Row>
			<Col xs="8">
				<b>{name}</b>
				<br />
				<small>{section}</small>
			</Col>
			<Col xs="4">
				<span className="float-right">
					<Button color="outline-danger">
						<FaSignOutAlt />
					</Button>
				</span>
			</Col>
		</Row>
	</div>
);

export default AlreadyLoggedBox;
