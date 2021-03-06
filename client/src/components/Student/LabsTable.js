import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody } from 'reactstrap';
import InfoBox from './InfoBox';

const LabsTable = ({ labs, tot_h, logout }) => (
	<Fragment>
		<Row>
			<Col>
				<Card>
					<CardBody>
						<Row>
							{labs.map((lab, index) => (
								<div
									className={
										'col-12 ' +
										(index !== (tot_h - 1)
											? 'mb-3 border-bottom'
											: '')
									}
									key={index}
								>
									<Row>
										<Col xs="3" className="py-2 pr-0">
											<span className="text-muted d-block text-center">
												Ora {index + 1}:
											</span>
										</Col>
										<Col xs="9" className="py-2 pl-0">
											<Row>
												<Col xs="12">
													<span className="d-block">
														{lab.title}
													</span>
												</Col>
												<Col xs="12">
													<span className="d-block text-muted">
														Aula: {lab.room}
													</span>
												</Col>
											</Row>
										</Col>
									</Row>
								</div>
							))}
						</Row>
					</CardBody>
				</Card>
			</Col>
		</Row>
		<InfoBox logout={logout} />
	</Fragment>
);

LabsTable.propTypes = {
	labs: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
    tot_h: PropTypes.number.isRequired
};

export default LabsTable;
