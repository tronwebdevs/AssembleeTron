import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createAssemblyInfo } from '../../../actions/assemblyActions';
import { Page, Grid, Card, Button, Alert } from "tabler-react";
import { Link, Redirect } from 'react-router-dom';
import SiteWrapper from '../../Admin/SiteWrapper/';
import InfoForm from '../../Admin/InfoForm';
import moment from 'moment';

const uuid = require('uuid/v4');

const CreateAssembly = ({
    assembly,
    createAssemblyInfo
}) => {

    const { error, exists, fetch_pending } = assembly;

    if (fetch_pending.create_info === false && exists === true && !error) {
        return <Redirect to={{ pathname: '/gestore/laboratori' }}/>
    } else if (exists === true) {   
        return <Redirect to={{ pathname: '/gestore/' }}/>
    } 

    return (
        <SiteWrapper>
            <Page.Content title="Crea Assemblea">
                <Grid.Row>
                    {error ? (
                        <Grid.Col width={12}>
                            <Alert type="danger">{error}</Alert>
                        </Grid.Col>
                    ) : null}
                </Grid.Row>
                <Grid.Row cards={true}>
                    <Grid.Col width={12}>
                        <Card title="Informazioni">
                            <Card.Body>
                                <InfoForm
                                    info={{
                                        uuid: uuid(),
                                        date: '2000-01-01',
                                        subOpen: '2000-01-01 14:00',
                                        subClose: '2000-01-01 20:00',
                                    }}
                                    onSubmit={
                                        (
                                            values,
                                            { setSubmitting, setErrors }
                                        ) => {
                                            setSubmitting(false);
                                            createAssemblyInfo({
                                                uuid: values.uuid,
                                                title: values.title,
                                                date: values.date,
                                                subOpen: moment(values.subOpenDate + ' ' + values.subOpenTime).format(),
                                                subClose: moment(values.subCloseDate + ' ' + values.subCloseTime).format()
                                            });
                                        }
                                    }
                                    buttons={[
                                        (
                                            <Link 
                                                className="btn btn-block btn-outline-danger"
                                                to="/gestore/"
                                            >Annulla</Link>
                                        ),
                                        (
                                            <Button 
                                                type="submit" 
                                                block 
                                                color="primary"
                                            >Continua</Button>
                                        )
                                    ]}
                                />
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
};

CreateAssembly.propTypes = {
    createAssemblyInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { createAssemblyInfo })(CreateAssembly);