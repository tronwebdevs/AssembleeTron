import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchStudents } from "../../../actions/assemblyActions";
import { Row, Col, Card } from "reactstrap";
import { SiteWrapper, StudentsTable, PageLoading } from "../../Admin/";

const Students = ({ assembly, fetchStudents }) => {
	const { students, pendings } = assembly;

	if (pendings.students === undefined) {
		fetchStudents();
	}

	return (
		<SiteWrapper title="Studenti">
			{pendings.assembly === false && pendings.assembly === false ? (
				<Row>
					<Col xs="12">
						<Card>
							<StudentsTable students={students} />
						</Card>
					</Col>
				</Row>
			) : (
				<PageLoading />
			)}
		</SiteWrapper>
	);
};

Students.propTypes = {
	assembly: PropTypes.object.isRequired,
	fetchStudents: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { fetchStudents })(Students);
