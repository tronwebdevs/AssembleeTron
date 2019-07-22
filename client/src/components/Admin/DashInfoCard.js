import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card } from 'tabler-react';

const DashInfoCard = ({
    title,
    listItems,
    button
}) => (
    <Grid.Col width={12} md={4}>
        <Card title={title}>
            <Card.Body>
                <React.Fragment>
                    <ul className="list-unstyled">
                        {listItems.map((item, index) => (
                            <li key={index}>
                                <Grid.Row className="align-items-center">
                                    <Grid.Col sm={3} md={3} lg={3}>{item.title}</Grid.Col>
                                    <Grid.Col auto>{item.text}</Grid.Col>
                                </Grid.Row>
                            </li>
                        ))}
                    </ul>
                    {button}
                </React.Fragment>
            </Card.Body>
        </Card>
    </Grid.Col>
);

DashInfoCard.propTypes = {
    title: PropTypes.string.isRequired
};

export default DashInfoCard;