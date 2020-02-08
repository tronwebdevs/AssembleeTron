import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import ExcClassForm from './ExcClassForm';
import cogoToast from 'cogo-toast';
import axios from 'axios';

const ExcClassModal = ({
	showModal,
	handleClose,
	authToken,
	excludeClassesFromLabs,
	createLab,
	updateLab,
	labs,
	tot_h
}) => {
	const [sections, setSections] = useState(null);

	useEffect(() => {
		async function fetchSections() {
			const resp = await axios.get('/api/students/sections', {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			const { data, response } = resp;
			if (data && data.code === 1) {
				setSections(data.sections);
			} else {
				let errorMessage = 'Errore inaspettato';
				if (response && response.data && response.data.message) {
					errorMessage = response.data.message;
				}
				cogoToast.error(errorMessage);
			}
		}
		if (sections === null) {
			fetchSections();
		}
	}, [setSections, sections, authToken]);

	return (
		<Modal
			isOpen={showModal}
			toggle={handleClose}
			style={{
				maxWidth: 800,
				width: '100%',
				margin: 'auto',
				padding: 5
			}}
		>
			<ExcClassForm
				tot_h={tot_h}
				sections={sections || []}
				handleReset={() => handleClose(false)}
				handleSubmit={(values, { setErrors, setSubmitting }) => {
					let sections = values.sections.map(s => s.value);
					const h = +values.h;
					excludeClassesFromLabs(h, sections)
						.then(() => {
							if (values.autoGenLab === true) {
								let labIndex = labs.findIndex(
									lab =>
										lab.title === 'Laboratorio libero' &&
										lab.room === '-' &&
										lab.description === '-'
								);
								let lab;
								if (labIndex === -1) {
									lab = {
										room: '-',
										title: 'Laboratorio libero',
										description: '-',
										two_h: false,
										info: []
									};
								} else {
									lab = labs[labIndex];
								}
								for (let i = 0; i < tot_h; i++) {
									if (lab.info[i] === undefined) {
										let infoH = {
											seats: 0,
											sections: []
										};
										if (i === h) {
											infoH.sections = sections;
											infoH.seats = sections.length * 40;
										}
										lab.info.push(infoH);
									} else {
										if (i === h) {
                                            for (let sect of sections) {
                                                if (!lab.info[i].sections.includes(sect)) {
                                                    lab.info[i].sections.push(sect);
                                                    lab.info[i].seats += 40;
                                                }
                                            }
										}
									}
								}
								if (labIndex === -1) {
									return createLab(lab);
								} else {
									return updateLab(lab);
								}
							}
							return;
						})
						.then(() => handleClose(false))
						.catch(err => {
							setSubmitting(false);
							console.log(err);
						});
				}}
			/>
		</Modal>
	);
};

ExcClassModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	authToken: PropTypes.string.isRequired,
	excludeClassesFromLabs: PropTypes.func.isRequired,
	createLab: PropTypes.func.isRequired,
	updateLab: PropTypes.func.isRequired,
	labs: PropTypes.array.isRequired,
	tot_h: PropTypes.number.isRequired
};

export default ExcClassModal;
