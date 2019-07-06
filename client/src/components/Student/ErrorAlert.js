import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Alert } from 'tabler-react';

const ErrorAlert = ({ message }) => (
    <Grid.Row>
        <Grid.Col>
            <Alert type="danger" >{message}</Alert>
        </Grid.Col>
    </Grid.Row>
);

ErrorAlert.propTypes = {
    message: PropTypes.string.isRequired
};

export default ErrorAlert;