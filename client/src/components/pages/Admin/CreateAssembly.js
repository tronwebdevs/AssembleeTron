import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createAssemblyInfo, loadAssembly } from '../../../actions/assemblyActions';
import { Page, Grid, Card, Button, Alert } from "tabler-react";
import { Link, Redirect } from 'react-router-dom';
import { SiteWrapper, InfoForm, ImportAssemblyCard } from '../../Admin/';
import moment from 'moment';

const CreateAssembly = ({
    admin,
    assembly,
    createAssemblyInfo,
    loadAssembly
}) => {

    const [displayMessage, setDisplayMessage] = useState({
        type: null,
        message: null
    });

    const authToken = admin.token;
    const { exists, pendings } = assembly;

    if (pendings.create_info === false && exists === true && displayMessage.message === null) {
        return <Redirect to={{ pathname: '/gestore/laboratori' }}/>
    } else if (exists === true) {   
        return <Redirect to={{ pathname: '/gestore/' }}/>
    } 

    return (
        <SiteWrapper>
            <Page.Content title="Crea Assemblea">
                <Grid.Row>
                    {displayMessage.message ? (
                        <Grid.Col width={12}>
                            <Alert type={displayMessage.type}>{displayMessage.message}</Alert>
                        </Grid.Col>
                    ) : null}
                </Grid.Row>
                <Grid.Row cards={true}>
                    <Grid.Col width={12}>
                        <Card title="Informazioni">
                            <Card.Body>
                                <InfoForm
                                    info={{
                                        title: '',
                                        date: moment().format('YYYY') + '-01-01',
                                        subscription: {
                                            open: moment().format('YYYY') + '-01-01 14:00',
                                            close: moment().format('YYYY') + '-01-01 20:00',
                                        },
                                        sections: []
                                    }}
                                    onSubmit={
                                        (
                                            { 
                                                _id, title, date, 
                                                subOpenDate, subOpenTime, 
                                                subCloseDate, subCloseTime,
                                                sections
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

                                                if (sections.length <= 0) {
                                                    errors.sections = 'Nessuna classe potrà partecipare all\'assemblea';
                                                }
    
                                                if (Object.entries(errors).length === 0) {
                                                    createAssemblyInfo({
                                                        _id, title, date,
                                                        subscription: {
                                                            open: subOpenMoment.format(),
                                                            close: subCloseMoment.format()
                                                        }, 
                                                        sections: sections.map(({ value }) => value)
                                                    })
                                                        .then(() => setSubmitting(false))
                                                        .catch(({ message }) => {
                                                            setSubmitting(false);
                                                            setDisplayMessage({
                                                                type: 'danger',
                                                                message
                                                            });
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
                                    setError={message => setDisplayMessage({
                                        type: 'danger',
                                        message
                                    })}
                                    authToken={authToken}
                                />
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                </Grid.Row>
                <Grid.Row cards={true}>
                    <Grid.Col width={12}>
                        <ImportAssemblyCard 
                            authToken={authToken}
                            setError={message => setDisplayMessage({
                                type: 'danger',
                                message
                            })}
                            loadAssembly={loadAssembly}
                            isSubmitting={pendings.load === true}
                        />
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
};

CreateAssembly.propTypes = {
    assembly: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    createAssemblyInfo: PropTypes.func.isRequired,
    loadAssembly: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly,
    admin: state.admin
});

export default connect(mapStateToProps, { createAssemblyInfo, loadAssembly })(CreateAssembly);