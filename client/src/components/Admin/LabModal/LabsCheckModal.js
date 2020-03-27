import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal, CardHeader, CardBody, Button } from 'reactstrap';
import { validateLabs } from '../../../utils/';
import SectionsList from '../../../utils/SectionsList';

const LabsCheckModal = ({ showModal, handleClose, labs, info }) => {
	let checkResult = null;
	if (showModal === true) {
		// Avoid JavaScript reference array clone
		let fLabs = JSON.parse(JSON.stringify(labs));

		fLabs = fLabs.map(lab => {
			for (let i = 0; i < info.tot_h; i++) {
				lab.info[i].sections = SectionsList.parse(
					lab.info[i].sections,
					info.sections
				).getList();
			}
			return lab;
		});
		checkResult = validateLabs(fLabs, info.sections, info.tot_h);
	}

	return (
		<Modal
			isOpen={showModal}
			toggle={handleClose}
			style={{
				maxWidth: 800,
				width: '100%',
				padding: 5
			}}
		>
			<div
				style={{
					borderTop: '5px solid',
					borderTopColor: '#17a2b8'
                }}
                class="tw-modal"
			>
				<CardHeader>
					<b>Controllo laboratori</b>
				</CardHeader>
				<CardBody>
					<Row>
						<Col xs="12" className="mb-2">
							Lista di classi che non possono iscriversi a nessun
							laboratorio:
						</Col>
					</Row>
					{checkResult !== null ? (
						<Row>
							<Col xs="12">
								<ul>
									{[...Array(info.tot_h).keys()].map(h => {
										let text;
										if (
											checkResult[h] &&
											checkResult[h].length > 0
										) {
											text = checkResult[h].join(', ');
										} else {
											text = 'Nessuna classe esclusa';
										}
										return (
											<li className="mb-2" key={h}>
												<b>Ora {h + 1}:</b> {text}
											</li>
										);
									})}
								</ul>
							</Col>
						</Row>
					) : null}
					<Row>
						<Col xs="12" md={{ size: '2', offset: '5' }}>
							<Button color="info" block onClick={handleClose}>
								Ok
							</Button>
						</Col>
					</Row>
				</CardBody>
			</div>
		</Modal>
	);
};

LabsCheckModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	labs: PropTypes.array.isRequired,
	info: PropTypes.object.isRequired
};

export default LabsCheckModal;
