import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from 'tabler-react';
import InfoBox from './InfoBox';

const LabsTable = ({ labs }) => (
    <>
        <Grid.Row>
            <Grid.Col width={12}>
                <Card>
                    <Card.Body>
                        <Grid.Row>
                            {labs.map((lab, index) => (
                                <div className={"col-12 " + (index !== 3 ? "mb-3 border-bottom" : "")} key={index}>
                                    <Grid.Row>
                                        <Grid.Col width={3} className="py-2 pr-0">
                                            <span className="text-muted d-block text-center">Ora {index + 1}:</span>
                                        </Grid.Col>
                                        <Grid.Col width={9} className="py-2 pl-0">
                                            <Grid.Row>
                                                <Grid.Col width={12}>
                                                    <span className="d-block">{lab.title}</span>
                                                </Grid.Col>
                                                <Grid.Col width={12}>
                                                    <span className="d-block text-muted">Aula: {lab.room}</span>
                                                </Grid.Col>
                                            </Grid.Row>
                                        </Grid.Col>
                                    </Grid.Row>
                                </div>
                            ))}
                        </Grid.Row>
                    </Card.Body>
                </Card>
            </Grid.Col>
        </Grid.Row>
        <InfoBox />
    </>
);

LabsTable.propTypes = {
    labs: PropTypes.array.isRequired
};

export default LabsTable;