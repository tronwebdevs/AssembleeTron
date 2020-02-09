import React from 'react';
import PropTypes from 'prop-types';
import { CardBody } from 'reactstrap';
import { Table, Icon } from 'tabler-react';
import { deleteModal } from '../Admin/';
import cogoToast from 'cogo-toast';

const LabsTable = ({ labs, setLabDisplay, deleteAssemblyLab, setShowModal }) =>
	labs.length > 0 ? (
		<Table
			responsive
			className="card-table table-vcenter text-wrap labs-table"
			style={{ fontSize: '0.85rem' }}
			headerItems={[
				{ content: '#', className: 'w-1' },
				{ content: 'Titolo' },
				{ content: 'Aula' },
				{ content: null, className: 'w-2' },
				{ content: null, className: 'w-2' }
			]}
			bodyItems={labs.map((lab, index) => ({
				key: lab._id,
				item: [
					{
						content: <span className="text-muted">{index + 1}</span>
					},
					{ content: lab.title },
					{ content: lab.room },
					{
						content: (
							<Icon
								link
								name="edit"
								onClick={() => {
									setLabDisplay({
										action: 'edit',
										lab
									});
									setShowModal(true);
								}}
							/>
						)
					},
					{
						content: (
							<Icon
								link
								name="trash-2"
								onClick={() =>
									deleteModal(
										`Vuoi davvero eliminare "${lab.title}"?`,
										() => {
											window.scrollTo({
												top: 0,
												behavior: 'smooth'
											});
											deleteAssemblyLab(lab._id)
												.then(labTitle =>
													cogoToast.success(
														`Laboratorio "${labTitle}" eliminato con successo`
													)
												)
												.catch(({ message }) =>
													cogoToast.error(message)
												);
										}
									)
								}
							/>
						)
					}
				]
			}))}
		/>
	) : (
		<CardBody>
			<p>Nessun laboratorio disponibile</p>
		</CardBody>
	);

LabsTable.propTypes = {
	labs: PropTypes.array.isRequired,
	setLabDisplay: PropTypes.func.isRequired,
	deleteAssemblyLab: PropTypes.func.isRequired,
	setShowModal: PropTypes.func.isRequired
};

export default LabsTable;
