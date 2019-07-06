import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Form, Button} from 'tabler-react';
import moment from 'moment';

const InfoCard = ({ info, edit }) => (
    <div>
        <Grid.Row>
            <Grid.Col width={12} lg={4}>
                <Form.Group label="Titolo">
                    <Form.Input
                        value={info.title}
                        className="mb-2"
                        disabled
                    />
                </Form.Group>
                <Form.Group label="Identificativo">
                    <Form.Input
                        value={info.uuid}
                        disabled
                    />
                </Form.Group>
            </Grid.Col>
            <Grid.Col width={12} lg={4}>
                <Form.Group label="Data">
                    <Form.Input
                        type="date"
                        value={info.date}
                        className="mb-2"
                        disabled
                    />
                </Form.Group>
            </Grid.Col>
            <Grid.Col width={12} lg={4}>
                <Form.Group label="Apertura iscrizioni">
                    <Grid.Row className="mb-2">
                        <Grid.Col width={12} lg={7}>
                            <Form.Input
                                type="date"
                                value={moment(info.subOpen).format('YYYY-MM-DD')}
                                disabled
                            />
                        </Grid.Col>
                        <Grid.Col width={12} lg={5}>
                            <Form.Input
                                type="time"
                                value={moment(info.subOpen).format('HH:mm')}
                                disabled
                            />
                        </Grid.Col>
                    </Grid.Row>
                </Form.Group>
                <Form.Group label="Chiusura iscrizioni">
                    <Grid.Row className="mb-2">
                        <Grid.Col width={12} lg={7}>
                        <Form.Input
                                type="date"
                                value={moment(info.subClose).format('YYYY-MM-DD')}
                                disabled
                            />
                        </Grid.Col>
                        <Grid.Col width={12} lg={5}>
                            <Form.Input
                                type="time"
                                value={moment(info.subClose).format('HH:mm')}
                                disabled
                            />
                        </Grid.Col>
                    </Grid.Row>
                </Form.Group>
            </Grid.Col>
        </Grid.Row>
        <Grid.Row className="mt-4">
            <Grid.Col md={2} className="offset-md-5">
                <Button block color="primary" onClick={edit}>Modifica</Button>
            </Grid.Col>
        </Grid.Row>
    </div>
);

InfoCard.propTypes = {
    info: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired
}

export default InfoCard;