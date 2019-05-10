import React from 'react';

const DefaultOption = ({ h }) => {
    let label;

    switch (h) {
        case 1:
            label = 'Prima Ora';
            break;
        case 2:
            label = 'Seconda Ora';
            break;
        case 3:
            label = 'Terza Ora';
            break;
        case 4:
            label = 'Quarta Ora';
            break;
        default:
            label = '';
            break;
    }

    return (
        <option value="default" disabled>{label}</option>
    );
};

export default DefaultOption;