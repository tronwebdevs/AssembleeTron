import React from "react";
import PropTypes from "prop-types";
import { Badge } from "reactstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";

const StudentsTable = ({ students, loading }) => {
	const columns = [
		{
			Header: "ID",
			accessor: "studentId"
		},
		{
			Header: "Nome",
			accessor: "name"
		},
		{
			Header: "Cognome",
			accessor: "surname"
		},
		{
			Header: "Classe",
			accessor: "section"
		},
		{
			Header: "Partecipa",
			accessor: "labs",
			Cell: props => {
				if (props.value !== null) {
					const { value } = props;
					const part =
						(value.h1 === -1 || value.h1 === null) &&
						value.h1 === value.h2 &&
						value.h3 === value.h4 &&
						value.h1 === value.h4;
					return (
						<Badge color={part ? "danger" : "success"}>
							{part ? "Partecipa" : "Non partecipa"}
						</Badge>
					);
				} else {
					return null;
				}
			}
		}
	];

	return (
		<ReactTable
			filterable
			data={students}
			columns={columns}
			previousText="Indietro"
			nextText="Avanti"
			loadingText="Caricamento..."
			noDataText="Nessuno studente trovato"
			pageText="Pagina"
			ofText="di"
			rowsText="righe"
			pageJumpText="vai alla pagina"
            rowsSelectorText="studenti per pagina"
            loading={loading}
		/>
	);
};

StudentsTable.propTypes = {
    students: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
};

export default StudentsTable;
