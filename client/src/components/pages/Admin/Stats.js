import React, { Fragment } from "react";
import { connect } from "react-redux";
import { fetchStudents } from "../../../actions/assemblyActions";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { colors } from "tabler-react";
import { PageLoading } from "../../Admin/";
import { processAssemblyStats } from "../../../utils/";
import C3Chart from "react-c3js";

const Stats = ({ assembly, fetchStudents }) => {
    const { pendings, students, info, labs } = assembly;
    
    if (pendings.students === undefined) {
		fetchStudents();
    }
    
    if (pendings.assembly === false && pendings.students === false) {
        const processedStats = processAssemblyStats(info, students, labs);

        return (
            <Row>
                {processedStats === null ? (
                    <Col xs="12">
                        <Card>
                            <CardBody>
			                    <p>Nessuno studente iscritto all'assemblea</p>
		                    </CardBody>
                        </Card>
                    </Col>
                ) : (
                    <Fragment>
                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <b>Iscritti nel tempo</b>
                                </CardHeader>
                                <C3Chart
                                    style={{ height: "10rem" }}
                                    data={{
                                        columns: processedStats.subsPerTime,
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
                                        <b>Massima attività</b><br />
                                        <span>Data: 
                                            {" " + processedStats.maxActive.date.start.format("DD/MM HH:mm") + 
                                             " - " + processedStats.maxActive.date.end.format("DD/MM HH:mm")}</span><br />
                                        <span>Totale: {processedStats.maxActive.count}</span>
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
                                            columns: processedStats.subsSections,
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
                                            columns: processedStats.subsYear,
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
                    </Fragment>
                )}
            </Row>
        );
    } else {
        return <PageLoading />;
    }
};

Stats.propTypes = {
    assembly: PropTypes.object.isRequired,
    fetchStudents: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps, { fetchStudents })(Stats);
