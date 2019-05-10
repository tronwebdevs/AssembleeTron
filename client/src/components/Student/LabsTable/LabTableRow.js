import React from 'react';

const LabTableRow = ({ lab, index }) => (
    <tr className="lab-row-confirm">
        <td>{index}</td>
        <td>{lab.title}</td>
        <td>{lab.room}</td>
    </tr>
);

export default LabTableRow;