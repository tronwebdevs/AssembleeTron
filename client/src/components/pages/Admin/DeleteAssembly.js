import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { deleteAssembly } from '../../../actions/assemblyActions';
import { Page, Grid, Alert, Button, Card } from 'tabler-react';
import SiteWrapper from '../../Admin/SiteWrapper';
import { ButtonGroup } from 'reactstrap';
import { Link } from 'react-router-dom';

const DeleteAssembly = ({
    assembly,
    deleteAssembly
}) => {

    const { fetch_pending, info } = assembly;
    if (fetch_pending.delete_assembly === false && info.deleted === true) {
        return <Redirect to={{ pathname: "/gestore/" }} />;
    }

    return (
        <SiteWrapper>
            <Page.Content title="Elimina Assemblea">
                <Grid.Row>
                    {assembly.error !== '' ? (
                        <Grid.Col width={12}>
                            <Alert type="danger">{assembly.error}</Alert>
                        </Grid.Col>
                    ) : null}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12} xl={6}>
                        <Card title="Crea backup">
                            <Card.Body>
                                <p>Prima di eliminare l'assemblea puoi creare un backup da utilizzare in un'eventuale assemblea futura simile.</p>
                                <ButtonGroup align="center">
                                    <Button color="outline-primary">Backup</Button>
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
                                        onClick={deleteAssembly}
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
    deleteAssembly: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { deleteAssembly })(DeleteAssembly);