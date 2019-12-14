import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchStudents } from "../../../actions/assemblyActions";
import { Row, Col, Card, CardHeader, Button } from "reactstrap";
import { /*StudentsTable,*/ PageLoading, StudentsSectionsTable, ListCard } from "../../Admin/";

const Students = ({ assembly, fetchStudents }) => {
	const { students, pendings } = assembly;

	if (pendings.students === undefined) {
		fetchStudents();
    }

    let sections = [];
    students.forEach(student => {
        const stdSec = sections.find(
            section => section.label === student.section
        );
        if (stdSec) {
            stdSec.students++;
        } else {
            sections.push({
                label: student.section,
                students: 1
            });
        }
    });

    if (pendings.assembly === false && pendings.students === false) {
        return (
            <Fragment>
                <Row>
                    <ListCard 
                        title="Studenti sul database"
                        items={[
                            { 
                                title: "Studenti totali: ", 
                                text: students.length,
                                colSize: "5"
                            },
                            { 
                                title: "Iscritti: ", 
                                text: students.filter(std => std.labs !== null).length,
                                colSize: "5"
                            }
                        ]}
                        buttons={(
                            <Row>
                                <Col xs="12" md="6">
                                    <Button 
                                        block 
                                        outline 
                                        color="danger"
                                        onClick={() => alert("Attualmente non disponibile")}
                                    >Elimina tutti</Button>
                                </Col>
                                <Col xs="12" md="6">
                                    <Button 
                                        block 
                                        outline 
                                        color="success"
                                        onClick={() => alert("Attualmente non disponibile")}
                                    >Carica</Button>
                                </Col>
                            </Row>
                        )}
                    />
                    <Col xs="12" md="4">
                        <Card>
                            <CardHeader>
                                <b>Studenti per classe</b>
                            </CardHeader>
                            <div style={{
                                overflow: "scroll",
                                height: "300px"
                            }}>
                                <StudentsSectionsTable sections={sections} />
                            </div>
                        </Card>
                    </Col>
                </Row>
                {/* <Row>
                    <Col xs="12">
                        <Card>
                            <StudentsTable 
                                students={students} 
                                loading={pendings.students === true}
                            />
                        </Card>
                    </Col>
                </Row> */}
            </Fragment>
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
