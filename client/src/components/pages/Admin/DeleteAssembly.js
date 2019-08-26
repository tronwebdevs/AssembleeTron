import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { deleteAssembly, requestBackup } from '../../../actions/assemblyActions';
import { Page, Grid, Alert, Button, Card } from 'tabler-react';
import { SiteWrapper } from '../../Admin/';
import { ButtonGroup } from 'reactstrap';

const DeleteAssembly = ({
    assembly,
    requestBackup,
    deleteAssembly
}) => {
    
    const [displayMessage, setDisplayMessage] = useState({
        type: null,
        message: null
    });

    const { pendings, info } = assembly;

    if (pendings.delete_assembly === false && info.deleted === true) {
        return <Redirect to={{ pathname: "/gestore/" }} />;
    }

    return (
        <SiteWrapper>
            <Page.Content title="Elimina Assemblea">
                <Grid.Row>
                    {displayMessage.message !== null ? (
                        <Grid.Col width={12}>
                            <Alert type={displayMessage.type}>{displayMessage.message}</Alert>
                        </Grid.Col>
                    ) : null}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12} xl={6}>
                        <Card title="Crea backup">
                            <Card.Body>
                                <p>Prima di eliminare l'assemblea puoi creare un backup da utilizzare in un'eventuale assemblea futura simile.</p>
                                <ButtonGroup align="center">
                                    <Button 
                                        color="outline-primary"
                                        onClick={e => {
                                            e.preventDefault();
                                            let { target } = e;
                                            target.disabled = true;
                                            requestBackup()
                                                .then(message => {
                                                    setDisplayMessage({
                                                        type: 'success',
                                                        message
                                                    });
                                                    target.className = 'btn btn-success';
                                                    target.innerText = 'Backup completato';
                                                })
                                                .catch(({ message }) => {
                                                    setDisplayMessage({
                                                        type: 'danger',
                                                        message
                                                    });
                                                    target.disabled = false;
                                                });
                                        }}
                                    >Backup</Button>
                                </ButtonGroup>
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                    <Grid.Col width={12} xl={6}>
                        <Card title="Elimina">
                            <Card.Body>
                                <p>Sicuro di voler eliminare definitivamente l'assemblea e tutti i suoi laboratori (questa azione e' irreversibile)?</p>
                                <ButtonGroup align="center">
                                    <Link 
                                        to="/gestore/"
                                        className="btn btn-secondary"
                                    >Annulla</Link>
                                    <Button 
                                        color="outline-danger"
                                        onClick={e => {
                                            e.preventDefault();
                                            let { target } = e;
                                            target.disabled = true;
                                            deleteAssembly().catch(({ message }) => {
                                                setDisplayMessage({
                                                    type: 'danger',
                                                    message
                                                });
                                                target.disabled = false;
                                            });
                                        }}
                                    >Si</Button>
                                </ButtonGroup>
                            </Card.Body>
                        </Card>
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
}

DeleteAssembly.propTypes = {
    assembly: PropTypes.object.isRequired,
    requestBackup: PropTypes.func.isRequired,
    deleteAssembly: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { deleteAssembly, requestBackup })(DeleteAssembly);