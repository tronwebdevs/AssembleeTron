import React from 'react';
import PropTypes from 'prop-types';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import './index.css';

const StudentsTable = ({
    students,
    height,
    scrollToIndex
}) => (
    <AutoSizer>
        {({ width }) => (
            <Table
                width={width}
                height={height}
                headerHeight={40}
                scrollToIndex={scrollToIndex}
                rowHeight={45}
                rowCount={students.length}
                rowGetter={({ index }) => students[index]}
                style={{ border: '1px solid #e0e0e0' }}
            >
                <Column
                    label='ID'
                    dataKey='ID'
                    width={150}
                />
                <Column
                    label='Nome'
                    dataKey='name'
                    width={300}
                />
                <Column
                    width={300}
                    label='Cognome'
                    dataKey='surname'
                />
                <Column
                    label='Classe'
                    dataKey='classLabel'
                    width={200}
                />
            </Table>
        )}
    </AutoSizer>
);

StudentsTable.propTypes = {
    students: PropTypes.array.isRequired
};

export default StudentsTable;