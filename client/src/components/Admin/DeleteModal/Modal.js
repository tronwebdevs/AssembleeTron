import React from 'react';
import PropTypes from 'prop-types';
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Modal,
	Button
} from 'reactstrap';

const DelModal = ({ visible, showModal, text, deleteFunc }) => (
	<Modal isOpen={visible} toggle={() => showModal(false)}>
		<div
			id="delete-lab-card-wrapper"
			style={{ boxShadow: '0 0 8px #9E9E9E' }}
		>
			<Card
				className="m-0 p-0"
				style={{
					borderTop: '5px solid',
					borderTopColor: '#fa4654'
				}}
			>
				<CardHeader>
					<b>Elimina laboratorio</b>
				</CardHeader>
				<CardBody>
					<Row>
						<Col xs="12">
                            <p>{text}</p>
						</Col>
					</Row>
					<Row>
						<Col
							xs="6"
							md={{ size: 4, offset: 2 }}
							className="px-1"
						>
                            <Button
								color="danger"
								block
								onClick={() => {
									deleteFunc();
									showModal(false);
								}}
							>
								Elimina
							</Button>
						</Col>
						<Col xs="6" md="4" className="px-1">
							<Button
								onClick={() => showModal(false)}
								color="primary"
								outline
								block
							>
								Annulla
							</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</div>
	</Modal>
);

DelModal.propTypes = {
	visible: PropTypes.bool.isRequired,
	showModal: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired,
	deleteFunc: PropTypes.func.isRequired
};

export default DelModal;
