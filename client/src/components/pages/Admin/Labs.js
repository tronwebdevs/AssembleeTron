import React, { useState } from 'react';
import { connect } from 'react-redux';
import { fetchAllLabs, deleteAssemblyLab } from '../../../actions/assemblyActions';
import PropTypes from 'prop-types';
import { Page, Grid, Card, Table, Text, Button, Icon, Alert } from "tabler-react";
import SiteWrapper from '../../Admin/SiteWrapper';
import LabForm from '../../Admin/LabForm/';

const Labs = ({
    assembly,
    fetchAllLabs,
    deleteAssemblyLab
}) => {

    if (assembly.fetch_pending.labs === undefined) {
        fetchAllLabs();
    }

    const [displayMessage, setDisplayMessage] = useState({
        type: 'error',
        message: null
    });
    const [labDisplay, setLabDisplay] = useState({
        action: 'create',
        lab: {}
    });

    const { labs } = assembly;

    return (
        <SiteWrapper>
            <Page.Content title="Laboratori">
                <Grid.Row>
                    {displayMessage.message ? (
                        <Grid.Col width={12}>
                            <Alert type={displayMessage.type === "error" ? "danger" : "success"}>{displayMessage.message}</Alert>
                        </Grid.Col>
                    ) : null}
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={12} xl={8}>
                        <Card title="Laboratori">
                            <Table
                                responsive
                                className="card-table table-vcenter text-wrap labs-table"
                                style={{ fontSize: '0.85rem' }}
                                headerItems={[
                                    { content: "#", className: "w-1" },
                                    { content: "Titolo" },
                                    { content: "Aula" },
                                    { content: null },
                                    { content: null },
                                ]}
                                bodyItems={labs.map(lab => ({
                                    key: lab.ID,
                                    item: [
                                        {
                                            content: (
                                                <Text RootComponent="span" muted>{lab.ID}</Text>
                                            ),
                                        },
                                        { content: lab.title },
                                        { content: lab.room },
                                        { content: <Icon link name="edit" onClick={() => {
                                            setLabDisplay({
                                                action: 'edit', 
                                                lab
                                            })
                                            const { top } = document.getElementById('form-card-wrapper').getBoundingClientRect();
                                            window.scrollTo({ top: (top + window.scrollY - 20), behavior: 'smooth' });
                                        }} /> },
                                        { content: <Icon link name="trash-2" onClick={() => {
                                            let answer = window.confirm(`Sicuro di voler eliminare il laboratorio ${lab.ID}?`);
                                            if (answer) {
                                                deleteAssemblyLab(lab.ID, (err, labID) => {
                                                    if (err) {
                                                        setDisplayMessage({
                                                            type: 'error',
                                                            message: err.message
                                                        });
                                                    } else {
                                                        setDisplayMessage({
                                                            type: 'success',
                                                            message: `Laboratorio ${labID} eliminato con successo`
                                                        });
                                                    }
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                });
                                            }
                                        }} /> },
                                    ]
                                }))
                                }
                            />
                        </Card>
                    </Grid.Col>
                    <Grid.Col width={12} xl={4}>
                        <Card>
                            <Card.Body>
                                <Grid.Row>
                                    <Grid.Col width={12} lg={6} className="pr-1">
                                        <Button 
                                            type="button"
                                            color="success" 
                                            block
                                            onClick={e => {
                                                if (labDisplay.action !== 'edit') {
                                                    setLabDisplay({
                                                        action: 'create',
                                                        lab: {}
                                                    })
                                                } else {
                                                    setDisplayMessage({
                                                        type: 'error',
                                                        message: 'Attualmente stai gia\' modificando un laboratorio'
                                                    })
                                                }
                                            }}
                                        >Crea</Button>
                                    </Grid.Col>
                                    <Grid.Col width={12} lg={6} className="pl-1">
                                        <Button color="outline-warning" block onClick={() => alert("Not implemented yet!")}>Controlla</Button>
                                    </Grid.Col>
                                </Grid.Row>
                            </Card.Body>
                        </Card>
                        {assembly.fetch_pending.labs === false ? <LabForm id={labs.length + 1} lab={labDisplay.lab} action={labDisplay.action} handleReset={() => setLabDisplay({ action: 'create', lab: {} })} setDisplayMessage={setDisplayMessage} /> : null}
                    </Grid.Col>
                </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
};

Labs.propTypes = {
    assembly: PropTypes.object.isRequired,
    fetchAllLabs: PropTypes.func.isRequired,
    deleteAssemblyLab: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps, { fetchAllLabs, deleteAssemblyLab })(Labs);