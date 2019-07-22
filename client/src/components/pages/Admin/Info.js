import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page, Grid, Card, Alert, Button } from "tabler-react";
import SiteWrapper from '../../Admin/SiteWrapper/';
import { updateAssemblyInfo } from '../../../actions/assemblyActions';
import InfoForm from '../../Admin/InfoForm';
import InfoCard from '../../Admin/InfoCard';
import moment from 'moment';

const Info = ({
    assembly,
    updateAssemblyInfo
}) => {

    const { pendings, info, error } = assembly;

	const [edit, setEdit] = useState(false);
	
	if (pendings.update_info === false && edit === true) {
		setEdit(false);
	}

    const renderInfo = info => edit === true ? (
        <InfoForm 
            info={info} 
            onSubmit={
                (
                    values, 
                    { setSubmitting, setErrors }
                ) => {
					setSubmitting(false);
					if (pendings.update_info !== true) {
						updateAssemblyInfo({
							uuid: values.uuid,
							title: values.title,
							date: values.date,
							subOpen: moment(values.subOpenDate + ' ' + values.subOpenTime).format(),
							subClose: moment(values.subCloseDate + ' ' + values.subCloseTime).format()
						});
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
                    {error ? (
                        <Grid.Col width={12}>
                            <Alert type="danger">{error}</Alert>
                        </Grid.Col>
                    ) : ''}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12}>
                        <Card>
                            <Card.Body>
                                {pendings.assembly === false || pendings.info === false ? renderInfo(info) : ''}
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