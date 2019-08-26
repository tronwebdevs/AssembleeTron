import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Page, Grid, Card } from "tabler-react";
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Pie,
    PieChart,
    BarChart,
    Bar,
    ResponsiveContainer
} from "recharts";
import { SiteWrapper } from "../../Admin/";

const Stats = ({ assembly }) => {
	const { students } = assembly;
	const data = [
		{ uv: 400, pv: 2400 },
		{ uv: 300, pv: 2200 },
		{ uv: 200, pv: 2400 }
	];
	let sections = [];
	students.forEach(student => {
		const stdSec = sections.find(
			section => section.name === student.classLabel
		);
		if (stdSec) {
			stdSec.count++;
		} else {
			sections.push({
				name: student.classLabel,
				count: 1
			});
		}
    });
    sections.sort((a, b) => ('' + a.name).localeCompare(b.name));

	return (
		<SiteWrapper>
			<Page.Content title="Statistiche">
				<Grid.Row>
					<Grid.Col width={12}>
						<Card>
							<Card.Body>
                                <Grid.Row>
                                    <Grid.Col width={12} xl={6}>
                                        <ResponsiveContainer height={400} width="100%">
                                            <BarChart
                                                data={sections}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Grid.Col>
                                    <Grid.Col width={12} xl={6}>
                                        <ResponsiveContainer height={400} width="100%">
                                            <LineChart
                                                data={data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="pv"
                                                    stroke="#8884d8"
                                                    activeDot={{ r: 8 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="uv"
                                                    stroke="#82ca9d"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Grid.Col>
                                </Grid.Row>
								
								<PieChart width={400} height={400}>
									<Pie
										data={sections}
										dataKey="count"
										cx={200}
										cy={200}
										fill="#8884d8"
									/>
								</PieChart>
							</Card.Body>
						</Card>
					</Grid.Col>
				</Grid.Row>
			</Page.Content>
		</SiteWrapper>
	);
};

Stats.propTypes = {
	assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps)(Stats);
