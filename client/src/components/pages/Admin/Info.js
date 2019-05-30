import React from 'react';
import { Page, Grid, Card } from "tabler-react";
import SiteWrapper from '../../Admin/SiteWrapper/';

const Info = ({
    ...props
}) => (
    <SiteWrapper>
        <Page.Content title="Informazioni">
            <Grid.Row>
                <Grid.Col width={12} md={4}>
                    <Card title="Empty">
                        <Card.Body className="text-muted">Empty</Card.Body>
                    </Card>
                </Grid.Col>
            </Grid.Row>
        </Page.Content>
    </SiteWrapper>
);

export default Info;