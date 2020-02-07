import React, { Fragment, useState } from 'react';
import { Collapse, CardBody, Card, Button } from 'reactstrap';

import ExampleImg from './libretto_tron.png';

const StudentIdHelp = () => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	return (
		<Fragment>
			<Button
				block
				color="link"
				className="text-muted text-center my-2"
				style={{
					textTransform: 'none'
				}}
				onClick={toggle}
			>
				Dove trovo la mia matricola?
			</Button>
			<Collapse isOpen={isOpen}>
				<Card>
					<CardBody>
						<img
							className="d-block mb-1"
							src={ExampleImg}
							alt="Libretto Tron"
						/>
						Puoi trovare la tua matricola nel libretto delle
						assenze, nella parte evidenziata in rosso in figura.{' '}
						<br />
						Per altre domande o problemi rivolgiti ai rappresentanti
						o al TronWeb.
					</CardBody>
				</Card>
			</Collapse>
		</Fragment>
	);
};

export default StudentIdHelp;
