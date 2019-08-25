import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Text, Button, Table } from 'tabler-react';
import { Spinner } from 'reactstrap';
import moment from 'moment';

const ImportAssemblyCard = ({ 
    loadAssembly,
    setError,
    isSubmitting
}) => {

    const [backups, setBackups] = useState([]);

    useEffect(() => {
        async function fetchBackups() {
            const fetchResult = await fetch('/api/assembly/backups');
            const result = await fetchResult.json();
            if (result.code === 1) {
                setBackups(result.backups);
            } else {
                setError(result.message || 'Errore inaspettato');
            }
        }
        fetchBackups();
      }, [setError]);

	return (
		<Card title="Backup">
                <Table
                    responsive
                    className="card-table table-vcenter text-wrap"
                    style={{ fontSize: "0.85rem" }}
                    headerItems={[
                        { content: "UUID" },
                        { content: "Titolo" },
                        { content: "Data" },
                        { content: null }
                    ]}
                    bodyItems={backups.map(({ info }, index) => ({
                        key: index,
                        item: [
                            {
                                content: (
                                    <Text RootComponent="span" muted>
                                        {info.uuid}
                                    </Text>
                                )
                            },
                            { content: info.title },
                            { content: moment(info.date).format('DD/MM/YYYY') },
                            {
                                content: (
                                    <Button 
                                        color="gray"
                                        onClick={e => {
                                            loadAssembly(info.uuid).catch(({ message }) => setError(message));
                                        }}
                                    >{isSubmitting ? <Spinner color="light" size="sm" /> : 'Carica'}</Button>
                                )
                            }
                        ]
                    }))}
                />
		</Card>
	);
};

ImportAssemblyCard.propTypes = {
    loadAssembly: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired
};

export default ImportAssemblyCard;