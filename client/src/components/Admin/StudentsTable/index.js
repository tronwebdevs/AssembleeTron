import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'tabler-react';
import ReactTable from 'react-table';
import 'react-table/react-table.css'


const StudentsTable = ({ students }) => {
    const columns = [
        {
            Header: 'ID',
            accessor: 'ID'
        },
        {
            Header: 'Nome',
            accessor: 'name'
        },
        {
            Header: 'Cognome',
            accessor: 'surname'
        },
        {
            Header: 'Classe',
            accessor: 'classLabel'
        },
        {
            Header: 'Partecipa',
            accessor: 'subscribed',
            Cell: props => {
                if (props.value !== null) {
                    const { value } = props;
                    const part = ( value.h1 === value.h2 ) && (value.h3 === value.h4) && value.h1 === value.h4;
                    return  <Badge color={part ? "success" : "danger"}>{part ? "Partecipa" : "Non partecipa"}</Badge>;
                } else {
                    return null;
                }
            }
        }
    ];

    return (
        <ReactTable
            filterable
            data={students}
            columns={columns}
            previousText="Indietro"
            nextText="Avanti"
            loadingText="Caricamento..."
            noDataText="Nessuno studente trovato"
            pageText="Pagina"
            ofText="di"
            rowsText="righe"
            pageJumpText="vai alla pagina"
            rowsSelectorText="studenti per pagina"
        />
    );
};

StudentsTable.propTypes = {
    students: PropTypes.array.isRequired
};

export default StudentsTable;