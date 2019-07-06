import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Table, Card } from 'tabler-react';
import InfoBox from './InfoBox';

const LabsTable = ({ labs }) => (
    <>
        <Grid.Row>
            <Grid.Col width={12}>
                <Card>
                    <Table
                        responsive
                        className="card-table table-vcenter text-nowrap"
                        style={{
                            fontSize: '0.75rem'
                        }}
                        headerItems={[
                            { content: "Ora", className: "w-1" },
                            { content: "Attività" },
                            { content: "Aula" }
                        ]}
                        bodyItems={labs.map((lab, index) => ({
                            key: (index + 1),
                            item: [
                                { content: (index + 1) },
                                { content: lab.title },
                                { content: lab.room }
                            ]
                        }))}
                    />
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