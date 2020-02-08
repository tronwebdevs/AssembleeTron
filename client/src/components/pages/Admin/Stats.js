import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { PageLoading, AdminAlert } from '../../Admin/';
import C3Chart from 'react-c3js';
import axios from 'axios';

const Stats = ({ admin, assembly }) => {
	const { pendings } = assembly;

	const authToken = admin.token;
	const [error, setError] = useState(null);
	const [stats, setStats] = useState(null);
	useEffect(() => {
		async function fetchStats() {
			const resp = await axios.get('/api/assembly/stats', {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			const { data, response } = resp;
			if (data && data.code === 1) {
				setStats({
					students: data.students,
					subscribeds: data.subscribeds
				});
			} else {
				let errorMessage = 'Errore inaspettato';
				if (response && response.data && response.data.message) {
					errorMessage = response.data.message;
				}
				setError(errorMessage);
			}
		}
		if (stats === null) {
			fetchStats();
		}
	}, [setError, setStats, stats, authToken]);

	if (pendings.assembly === false) {
		return (
			<Fragment>
				<AdminAlert display={error !== null} message={error} />
				<Row>
					{stats === null ? (
						<Col xs="12">
							<Card>
								<CardBody>
									<p>
										Nessuno studente iscritto all'assemblea
									</p>
								</CardBody>
							</Card>
						</Col>
					) : (
						<Fragment>
							{/* <Col xs="12" md="6">
                                <Card>
                                    <CardHeader>
                                        <b>Iscritti nel tempo</b>
                                    </CardHeader>
                                    <C3Chart
                                        style={{ height: "10rem" }}
                                        data={{
                                            columns: stats.subs,
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
                                </Card>
                            </Col> */}
							<Col xs="12" md="3">
								<Card>
									<CardHeader>
										<b>Iscritti totali</b>
									</CardHeader>
									<CardBody>
										<C3Chart
											style={{ height: '14rem' }}
											data={{
												columns: [
													[
														'Non Iscritti',
														stats.students -
															stats.subscribeds
																.total
													],
													[
														'Partecipano',
														stats.subscribeds.part
													],
													[
														'Non Partecipano',
														stats.subscribeds
															.total -
															stats.subscribeds
																.part
													]
												],
												type: 'pie'
											}}
											legend={{ show: false }}
											padding={{
												bottom: 0,
												top: 0
											}}
										/>
									</CardBody>
								</Card>
							</Col>
						</Fragment>
					)}
				</Row>
			</Fragment>
		);
	} else {
		return <PageLoading />;
	}
};

Stats.propTypes = {
	assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	admin: state.admin,
	assembly: state.assembly
});

export default connect(mapStateToProps)(Stats);
