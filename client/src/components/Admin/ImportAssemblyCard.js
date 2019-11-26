import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Table } from "tabler-react";
import { Card, CardHeader, Button, Spinner } from "reactstrap";
import moment from "moment";
import axios from "axios";

const ImportAssemblyCard = ({
	authToken,
	loadAssembly,
	setError,
	isSubmitting
}) => {
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
		fetchBackups();
	}, [setError, authToken]);

	return (
		<Card>
			<CardHeader>
				<b>Backup</b>
			</CardHeader>
			<Table
				responsive
				className="card-table table-vcenter text-wrap"
				style={{ fontSize: "0.85rem" }}
				headerItems={[
					{ content: "ID" },
					{ content: "Titolo" },
					{ content: "Data" },
					{ content: null }
				]}
				bodyItems={backups.map(({ info }, index) => ({
					key: index,
					item: [
						{
							content: <span className="muted">{info._id}</span>
						},
						{ content: info.title },
						{ content: moment(info.date).format("DD/MM/YYYY") },
						{
							content: (
								<Button
									color="gray"
									onClick={e => {
										loadAssembly(
											info._id
										).catch(({ message }) =>
											setError(message)
										);
									}}
								>
									{isSubmitting ? (
										<Spinner color="light" size="sm" />
									) : (
										"Carica"
									)}
								</Button>
							)
						}
					]
				}))}
			/>
		</Card>
	);
};

ImportAssemblyCard.propTypes = {
	authToken: PropTypes.string.isRequired,
	loadAssembly: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	isSubmitting: PropTypes.bool.isRequired
};

export default ImportAssemblyCard;
