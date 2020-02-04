import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table } from "reactstrap";
import axios from "axios";

const BackupsTable = ({ authToken, setError, button }) => {
    const [backups, setBackups] = useState([]);
    useEffect(() => {
		async function fetchBackups() {
			const resp = await axios.get("/api/assembly/backups", {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			const { data, response } = resp;
			if (data && data.code === 1) {
				setBackups(data.backups);
			} else {
				let errorMessage = "Errore inaspettato";
				if (response && response.data && response.data.message) {
					errorMessage = response.data.message;
				}
				setError(errorMessage);
			}
        }
        if (backups.length === 0) {
            fetchBackups();
        }
    }, [setError, authToken, backups]);
    
    if (backups.length > 0) {
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
                            <td>{backup.info._id}</td>
                            <td>{backup.info.title}</td>
                            <td>{button}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    } else {
        return <span></span>;
    }
};

BackupsTable.propTypes = {
    setError: PropTypes.func.isRequired,
    authToken: PropTypes.string.isRequired,
    button: PropTypes.element
};

export default BackupsTable;