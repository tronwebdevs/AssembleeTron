import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'reactstrap';
import axios from 'axios';
import cogoToast from 'cogo-toast';

const BackupsTable = ({ authToken, button }) => {
	const [backups, setBackups] = useState(null);
	useEffect(() => {
		async function fetchBackups() {
			const resp = await axios.get('/api/assembly/backups', {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			const { data, response } = resp;
			if (data && data.code === 1) {
				setBackups(data.backups);
			} else {
				let errorMessage = 'Errore inaspettato';
				if (response && response.data && response.data.message) {
					errorMessage = response.data.message;
				}
				setBackups([]);
				cogoToast.error(errorMessage);
			}
		}
		if (backups === null) {
			fetchBackups();
		}
    }, [authToken, backups]);
	const { label, color, handleClick, ...rest } = button;

	if (backups && backups.length > 0) {
		return (
			<Table className="mb-0" responsive={true}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Nome</th>
						<th>Azioni</th>
					</tr>
				</thead>
				<tbody>
					{backups.map((backup, index) => (
						<tr key={index}>
							<td>{backup._id}</td>
							<td>{backup.title}</td>
							<td>
								<Button
									color={color}
									onClick={e => handleClick(e, backup, setBackups)}
									{...rest}
								>
									{label}
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		);
	} else {
		return (
			<span className="d-block mb-4 text-muted text-center">
				Nessun backup trovato
			</span>
		);
	}
};

BackupsTable.propTypes = {
	authToken: PropTypes.string.isRequired,
	button: PropTypes.object
};

export default BackupsTable;
