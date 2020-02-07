import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

const StudentsSectionsTable = ({ sections }) => (
	<Table>
		<thead>
			<tr>
				<th>Classe</th>
				<th>N Studenti</th>
			</tr>
		</thead>
		<tbody>
			{sections.map(({ label, students }, index) => (
				<tr key={index}>
					<td>{label}</td>
					<td>{students}</td>
				</tr>
			))}
		</tbody>
	</Table>
);

StudentsSectionsTable.propTypes = {
	sections: PropTypes.array.isRequired
};

export default StudentsSectionsTable;
