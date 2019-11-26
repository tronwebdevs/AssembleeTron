import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

const InfoBox = () => (
	<Row>
		<Col>
			<Card>
				<CardBody className="text-center p-3">
					<small>
						<p className="font-weight-bold mb-1">
							Conserva questa tabella! Ti consigliamo di salvare
							uno screenshot di questa schermata prima di uscire.
						</p>
						<p className="font-weight-bold mb-1">
							Potrai visualizzarla nuovamente inserendo la tua
							matricola nella <a href="/">pagina di login</a>
						</p>
						<p className="mb-0">
							Per disiscriverti dall'assemblea vai alla{" "}
							<a href="/">pagina di login</a> e seleziona "Non
							partecipo"
						</p>
					</small>
				</CardBody>
			</Card>
		</Col>
	</Row>
);

export default InfoBox;
