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

    const { error, exists, pendings } = assembly;

    if (pendings.create_info === false && exists === true && error === null) {
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
                                        title: '',
                                        date: moment().format('YYYY') + '-01-01',
                                        subOpen: moment().format('YYYY') + '-01-01 14:00',
                                        subClose: moment().format('YYYY') + '-01-01 20:00',
                                    }}
                                    onSubmit={
                                        (
                                            { 
                                                uuid, title, date, 
                                                subOpenDate, subOpenTime, 
                                                subCloseDate, subCloseTime 
                                            },
                                            { setSubmitting, setErrors }
                                        ) => {
                                            if (pendings.create_info === undefined) {
                                                let errors = {};
                                                if (title === null || title.trim() === '') {
                                                    errors.title = 'Il titolo non puo\' restare vuoto';
                                                }
                                                let dateMoment = moment(date);
                                                let subOpenMoment = moment(subOpenDate + ' ' + subOpenTime);
                                                let subCloseMoment = moment(subCloseDate + ' ' + subCloseTime);
    
                                                if (dateMoment.diff(moment()) < 0) {
                                                    errors.date = 'La data dell\'assemblea non puo\' essere passata';
                                                }
    
                                                if (subOpenMoment.diff(moment()) < 0) {
                                                    errors.subOpenDate = 'Le iscrizioni non possono essere gia\' aperte';
                                                } else if (subOpenMoment.diff(dateMoment) > 0) {
                                                    errors.subOpenDate = 'Le iscrizioni non possono aprire dopo la data dell\'assemblea';
                                                }
    
                                                if (subCloseMoment.diff(moment()) < 0) {
                                                    errors.subCloseDate = 'Le iscrizioni non possono essere gia\' chiuse';
                                                } else if (subCloseMoment.diff(dateMoment) > 0) {
                                                    errors.subCloseDate = 'Le iscrizioni non possono chiudere dopo la data dell\'assemblea';
                                                } else if (subCloseMoment.diff(subOpenMoment) < 0) {
                                                    errors.subCloseDate = 'Le iscrizioni non possono chiudere prima di iniziare';
                                                }
    
    
                                                if (Object.entries(errors).length === 0) {
                                                    setSubmitting(false);
                                                    createAssemblyInfo({
                                                        uuid, title, date,
                                                        subOpen: subOpenMoment.format(),
                                                        subClose: subCloseMoment.format()
                                                    });
                                                } else {
                                                    setSubmitting(false);
                                                    setErrors(errors);
                                                }
                                            }
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
	assembly: PropTypes.object.isRequired,
    createAssemblyInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { createAssemblyInfo })(CreateAssembly);