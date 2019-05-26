import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from 'tabler-react';

const StudentBadge = ({ student, ...rest }) => (
    <Grid.Col width={12} {...rest}>
        <Card className="text-center bg-primary text-white">
            <h6 className="my-4">{student.name} {student.surname} - {student.classLabel}</h6>
        </Card>
    </Grid.Col>
);

StudentBadge.propTypes = {
    student: PropTypes.object.isRequired
};

export default StudentBadge;
