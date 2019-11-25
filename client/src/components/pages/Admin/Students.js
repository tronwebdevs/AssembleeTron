import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'reactstrap';
import { SiteWrapper, StudentsTable, PageLoading } from '../../Admin/';

const Students = ({ assembly }) => {

    const { students, pendings } = assembly;

    return (
        <SiteWrapper title="Studenti">
            {pendings.assembly === false ? (
                <Row>
                    <Col xs="12">
                        <Card>
                            <StudentsTable students={students}/>
                        </Card>
                    </Col>
                </Row>
            ) : <PageLoading/>}
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