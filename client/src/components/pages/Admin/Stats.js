import React, { Fragment } from "react";
import { connect } from "react-redux";
import { fetchStudents } from "../../../actions/assemblyActions";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { colors } from "tabler-react";
import { PageLoading } from "../../Admin/";
import C3Chart from "react-c3js";
import moment from "moment";

const Stats = ({ assembly, fetchStudents }) => {
    const { pendings, students, info } = assembly;
    
    if (pendings.students === undefined) {
		fetchStudents();
    }
    
    let subsSections = [];
    let subsYear = [];
    let subsPerTime = [];
    let maxActive = { 
        date: { start: null, end: null }, 
        count: 0 
    };
    if (pendings.assembly === false && pendings.students === false) {
        maxActive.date.start = moment(info.subscription.open);
        maxActive.date.end = moment(info.subscription.close);
        subsPerTime = [["subscriptions"]];
        students.forEach(student => {
            if (student.labs !== null) {
                const stdSec = subsSections.find(
                    section => section[0] === student.section
                );
                const stdYear = subsYear.find(
                    year => year[0] === student.section[0]
                );
                if (stdSec) {
                    stdSec[1]++;
                } else {
                    subsSections.push([
                        student.section,
                        1
                    ]);
                }
                if (stdYear) {
                    stdYear[1]++;
                } else {
                    subsYear.push([
                        student.section[0],
                        1
                    ]);
                }
            }
        });
        subsSections = subsSections.sort((a, b) => ("" + a[0]).localeCompare(b[0]));

        let subscribeds = students.filter(std => std.labs !== null);
        let hoursOpen = moment(info.subscription.close).diff(moment(info.subscription.open), 'h');
        let increment = parseInt(hoursOpen / 40, 10);
        let timeCounterStart = moment(info.subscription.open);
        let timeCounterEnd = moment(info.subscription.open).add(increment, 'h');
        do {
            let studentsLength = subscribeds.filter(student => {
                let createdAt = moment(student.labs.createdAt);
                return (
                    createdAt.diff(timeCounterStart) >= 0 && 
                    createdAt.diff(timeCounterEnd) <= 0
                );
            }).length;
            if (studentsLength > maxActive.count) {
                maxActive.date.start = timeCounterStart;
                maxActive.date.end = timeCounterEnd;
                maxActive.count = studentsLength;
            }
            subsPerTime[0].push(studentsLength);
            timeCounterStart.add(increment, 'h');
            timeCounterEnd.add(increment, 'h');
        } while (moment(info.subscription.close).diff(timeCounterEnd) >= 0);
    }

	return (
        <Fragment>
            {pendings.assembly === false &&
             pendings.students === false ? (
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <b>Iscritti nel tempo</b>
                            </CardHeader>
                            <C3Chart
                                style={{ height: "10rem" }}
                                data={{
                                    columns: subsPerTime,
                                    type: "area",
                                    colors: {
                                        subscriptions: colors["blue"],
                                    },
                                    names: {
                                        subscriptions: "Iscritti",
                                    },
                                }}
                                axis={{
                                    y: {
                                        padding: {
                                            bottom: 0,
                                        },
                                        show: false,
                                        tick: {
                                            outer: false,
                                        },
                                    },
                                    x: {
                                        padding: {
                                            left: 0,
                                            right: 0,
                                        },
                                        show: false,
                                    },
                                }}
                                legend={{
                                    position: "inset",
                                    padding: 0,
                                    inset: {
                                        anchor: "top-left",
                                        x: 20,
                                        y: 8,
                                        step: 10,
                                    },
                                }}
                                tooltip={{
                                    format: {
                                        title: function(x) {
                                            return "";
                                        },
                                    },
                                }}
                                padding={{
                                    bottom: 0,
                                    left: -1,
                                    right: -1,
                                }}
                                point={{ show: false }}
                            />
                            <CardBody>
                                <p>
                                    <b>Massima attivita'</b><br />
                                    <span>Data: 
                                        {maxActive.date.start.format("DD/MM HH:mm") + " - " + 
                                        maxActive.date.end.format("DD/MM HH:mm")}</span><br />
                                    <span>Totale: {maxActive.count}</span>
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" md="3">
                        <Card>
                            <CardHeader>
                            <b>Iscritti per classe</b>
                            </CardHeader>
                            <CardBody>
                                <C3Chart
                                    style={{ height: "14rem" }}
                                    data={{
                                        columns: subsSections,
                                        type: "pie"
                                    }}
                                    legend={{ show: false }}
                                    padding={{
                                        bottom: 0,
                                        top: 0,
                                    }}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" md="3">
                        <Card>
                            <CardHeader>
                            <b>Iscritti per anno</b>
                            </CardHeader>
                            <CardBody>
                                <C3Chart
                                    style={{ height: "14rem" }}
                                    data={{
                                        columns: subsYear,
                                        type: "pie"
                                    }}
                                    legend={{ show: false }}
                                    padding={{
                                        bottom: 0,
                                        top: 0,
                                    }}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            ) : <PageLoading />}
        </Fragment>
	);
};

Stats.propTypes = {
    assembly: PropTypes.object.isRequired,
    fetchStudents: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { fetchStudents })(Stats);
