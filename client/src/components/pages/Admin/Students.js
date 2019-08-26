import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page, Grid, Card } from "tabler-react";
import { SiteWrapper, StudentsTable } from '../../Admin/';

const Students = ({ assembly }) => {

    const { students } = assembly;

    return (
        <SiteWrapper>
            <Page.Content title="Studenti">
                <Grid.Row>
                    <Grid.Col width={12}>
                        <Card>
                            <StudentsTable students={students}/>
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