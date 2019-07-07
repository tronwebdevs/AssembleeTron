import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page, Grid, Card, Alert, Button } from "tabler-react";
import SiteWrapper from '../../Admin/SiteWrapper/';
import { fetchAssemblyInfo, updateAssemblyInfo } from '../../../actions/assemblyActions';
import InfoForm from '../../Admin/InfoForm';
import InfoCard from '../../Admin/InfoCard';
import moment from 'moment';

const Info = ({
    assembly,
    fetchAssemblyInfo,
    updateAssemblyInfo
}) => {

    const { fetch_pending, info } = assembly;

    if (fetch_pending.admin_dashboard === undefined && fetch_pending.info === undefined) {
        fetchAssemblyInfo();
    }

    const [edit, setEdit] = useState(false);
    const [displayError, setDisplayError] = useState('');

    const renderInfo = info => edit === true ? (
        <InfoForm 
            info={info} 
            onSubmit={
                (
                    values, 
                    { setSubmitting, setErrors }
                ) => {
                    updateAssemblyInfo({
                        uuid: values.uuid,
                        title: values.title,
                        date: values.date,
                        subOpen: moment(values.subOpenDate + ' ' + values.subOpenTime).format(),
                        subClose: moment(values.subCloseDate + ' ' + values.subCloseTime).format()
                    }, (err, info) => {
                        setSubmitting(false);
                        if (err) {
                            displayError(err.message);
                        } else {
                            setEdit(false);
                        }
                    });
                }
            }
            buttons={[
                (
                    <Button 
                        type="button"
                        block 
                        onClick={() => {
                            setEdit(false);
                            setDisplayError('');
                        }} 
                        color="outline-danger"
                    >Annulla</Button>
                ),
                (
                    <Button 
                        type="submit" 
                        block 
                        color="primary"
                    >Salva</Button>
                )
            ]}
        />
    ) : (
        <InfoCard 
            info={info} 
            edit={() => {
                    setEdit(true);
                // if (moment().diff(moment(info.subOpen)) < 0) {
                // } else {
                //     setDisplayError('Non puoi modificare le informazioni dell\'assemblea dato che le iscrizioni hanno gia\' inizato')
                // }
            }} 
        />
    );

    return (
        <SiteWrapper>
            <Page.Content title="Informazioni">
                <Grid.Row>
                    {displayError ? (
                        <Grid.Col width={12}>
                            <Alert type="danger">{displayError}</Alert>
                        </Grid.Col>
                    ) : ''}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12}>
                        <Card>
                            <Card.Body>
                                {fetch_pending.admin_dashboard === false || fetch_pending.info === false ? renderInfo(info) : ''}
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
    fetchAssemblyInfo: PropTypes.func.isRequired,
    updateAssemblyInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAssemblyInfo, updateAssemblyInfo })(Info);