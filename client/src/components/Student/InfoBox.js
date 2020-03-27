import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';

const InfoBox = ({ logout }) => (
	<Row>
		<Col>
			<Card>
				<CardBody className="text-center p-3 info-sub-card">
					<small>
						<p className="font-weight-bold mb-1">
							Conserva questa tabella! Ti consigliamo di salvare
							uno screenshot di questa schermata prima di uscire.
						</p>
						<p className="font-weight-bold mb-1">
							Potrai visualizzarla nuovamente inserendo la tua
							matricola nella{' '}
							<Button
								color="link"
								onClick={logout}
								className="p-0 mb-1"
								style={{
									textTransform: 'lowercase'
								}}
							>
								pagina di login
							</Button>
						</p>
						<p className="mb-0">
							Per disiscriverti dall'assemblea vai alla{' '}
							<Button
								color="link"
								onClick={logout}
								className="p-0 mb-1"
								style={{
									textTransform: 'lowercase'
								}}
							>
								pagina di login
							</Button>{' '}
							e seleziona "Non partecipo"
						</p>
					</small>
				</CardBody>
			</Card>
		</Col>
	</Row>
);

InfoBox.propTypes = {
	logout: PropTypes.func.isRequired
};

export default InfoBox;
