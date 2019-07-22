import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page, Grid, Card, Alert, Form } from "tabler-react";
import SiteWrapper from '../../Admin/SiteWrapper';
import StudentsTable from '../../Admin/StudentsTable';

const Students = ({
    assembly
}) => {

    const { students } = assembly;

    const [scrollToIndex, setScrollToIndex] = useState(undefined);

    const tableHeight = 400;

    return (
        <SiteWrapper>
            <Page.Content title="Studenti">
                <Grid.Row>
                    {assembly.error ? (
                        <Grid.Col width={12}>
                            <Alert type="danger">{assembly.error}</Alert>
                        </Grid.Col>
                    ) : null}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12}>
                        <Card title="Studenti" className="pb-5">
                            <Form className="p-4">
                                <Grid.Row>
                                    <Grid.Col width={12} xl={4}>
                                        <Form.Group label='ID'>
                                            <Form.Input
                                                type="number"
                                                placeholder="Cerca ID"
                                            />
                                        </Form.Group>
                                    </Grid.Col>
                                    <Grid.Col width={12} xl={4}>
                                        <Form.Group label='Nome'>
                                            <Form.Input
                                                type="text"
                                                placeholder="Cerca nome"
                                            />
                                        </Form.Group>
                                    </Grid.Col>
                                    <Grid.Col width={12} xl={4}>
                                        <Form.Group label='Cognome'>
                                            <Form.Input
                                                type="text"
                                                placeholder="Cerca cognome"
                                            />
                                        </Form.Group>
                                    </Grid.Col>
                                </Grid.Row>
                            </Form>
                            <div style={{ height: tableHeight }}>
                                <StudentsTable
                                    students={students}
                                    height={tableHeight}
                                    scrollToIndex={scrollToIndex}
                                />
                            </div>
                            {/* <Table
                                responsive
                                className="card-table table-vcenter text-wrap labs-table"
                                style={{ fontSize: '0.85rem' }}
                                headerItems={[
                                    { content: "ID", className: "w-4" },
                                    { content: "Nome" },
                                    { content: "Cognome" },
                                    { content: "Classe" },
                                ]}
                                bodyItems={students.map((std, index) => ({
                                    key: index,
                                    item: [
                                        { content: std.ID },
                                        { content: std.name },
                                        { content: std.surname },
                                        { content: std.classLabel },
                                    ]
                                }))
                                }
                            /> */}
                        </Card>
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
};

Students.propTypes = {
	assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps)(Students);