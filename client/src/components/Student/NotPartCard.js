import React from 'react';
import { Grid, Card } from 'tabler-react';

const NotPartCard = props => (
    <Grid.Row>
        <Grid.Col>
            <Card>
                <Card.Body className="text-center font-weight-bold text-uppercase">
                    <span className="text-danger">Non partecipi all'assemblea</span>
                </Card.Body>
            </Card>
        </Grid.Col>
    </Grid.Row>
);

export default NotPartCard;