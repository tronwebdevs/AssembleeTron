import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchStudents } from "../../../actions/assemblyActions";
import { Row, Col, Card } from "reactstrap";
import { StudentsTable, PageLoading } from "../../Admin/";

const Students = ({ assembly, fetchStudents }) => {
	const { students, pendings } = assembly;

	if (pendings.students === undefined) {
		fetchStudents();
	}

    if (pendings.assembly === false) {
        return (
            <Row>
                <Col xs="12">
                    <Card>
                        <StudentsTable 
                            students={students} 
                            loading={pendings.students === true}
                        />
                    </Card>
                </Col>
            </Row>
        );
    } else {
        return <PageLoading />;
    }
};

Students.propTypes = {
	assembly: PropTypes.object.isRequired,
	fetchStudents: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { fetchStudents })(Students);
