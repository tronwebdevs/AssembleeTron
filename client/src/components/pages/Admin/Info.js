import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page, Grid, Card, Alert, Button } from "tabler-react";
import { updateAssemblyInfo } from '../../../actions/assemblyActions';
import { SiteWrapper, InfoForm, InfoCard } from '../../Admin/';
import moment from 'moment';

const Info = ({
    assembly,
    updateAssemblyInfo
}) => {

    const { pendings, info } = assembly;

	const [edit, setEdit] = useState(false);
	const [displayMessage, setDisplayMessage] = useState({
        type: null,
        message: null
    });

    const renderInfo = info => edit === true ? (
        <InfoForm 
            info={info} 
            onSubmit={
                (
                    { 
                        uuid, title, date, 
                        subOpenDate, subOpenTime, 
                        subCloseDate, subCloseTime 
                    },
                    { setSubmitting, setErrors }
                ) => {
					if (pendings.update_info !== true) {
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

                        if (subOpenMoment.diff(dateMoment) > 0) {
                            errors.subOpenDate = 'Le iscrizioni non possono aprire dopo la data dell\'assemblea';
                        }

                        if (subCloseMoment.diff(dateMoment) > 0) {
                            errors.subCloseDate = 'Le iscrizioni non possono chiudere dopo la data dell\'assemblea';
                        } else if (subCloseMoment.diff(subOpenMoment) < 0) {
                            errors.subCloseDate = 'Le iscrizioni non possono chiudere prima di iniziare';
                        }


                        if (Object.entries(errors).length === 0) {
                            updateAssemblyInfo({
                                uuid, title, date,
                                subOpen: subOpenMoment.format(),
                                subClose: subCloseMoment.format()
                            }).then(message => setDisplayMessage({
                                type: 'success',
                                message
                            })).catch(({ message }) => setDisplayMessage({
                                type: 'danger',
                                message
                            })).finally(() => {
                                setEdit(false);
                                setSubmitting(false);
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
                    <Button 
                        type="button"
                        block 
                        onClick={() => {
                            setEdit(false);
                        }} 
                        color="outline-danger"
                    >Annulla</Button>
                ),
                (
                    <Button 
                        type="submit" 
                        block 
                        color="primary"
                        disabled={pendings.info === true}
                    >Salva</Button>
                )
            ]}
        />
    ) : (
        <InfoCard 
            info={info} 
            edit={() => setEdit(true)} 
        />
    );

    const checkIfExists = info => assembly.exists === false ? (
        <p>Devi creare un'assemblea prima di poter visualizzare le informazioni</p>
    ) : renderInfo(info);

    return (
        <SiteWrapper>
            <Page.Content title="Informazioni">
                <Grid.Row>
                    {displayMessage.message ? (
                        <Grid.Col width={12}>
                            <Alert type={displayMessage.type}>{displayMessage.message}</Alert>
                        </Grid.Col>
                    ) : ''}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12}>
                        <Card>
                            <Card.Body>
                                {pendings.assembly === false || pendings.info === false ? checkIfExists(info) : ''}
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
};

Info.propTypes = {
    assembly: PropTypes.object.isRequired,
    updateAssemblyInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { updateAssemblyInfo })(Info);