import React from 'react';
import { Grid } from 'tabler-react';
import Select from 'react-select';

const Selector = ({ 
    name, 
    value, 
    setValue, 
    classes, 
    ...rest 
}) => {
    
    const options = [{
        label: 'Classi',
        options: classes.map(c => ({ label: c, value: c }))
    }];

    const customStyle = {
        control: provided => ({
            ...provided,
            borderColor: '#ced4da',
            borderRadius: '3px',
        }),
        indicatorSeparator: provided => ({
            ...provided,
            borderColor: '#ced4da',
            backgroundColor: '#ced4da'
        }),
    }

    const groupHeadingStyle = {
        margin: 0,
        padding: 0
    }

    const buttonStyle = {
        display: 'block',
        width: '100%',
        padding: '8px 10px',
        backgroundColor: '#fbfbfc',
        border: 'none',
        borderTop: '1px solid #ced4da'
    }

    const GroupHeading = ({ selectProps }) => (
        <div style={groupHeadingStyle}>
            <Grid.Row className="m-0">
                <Grid.Col width={6} className="p-0">
                    <button 
                        type="button" 
                        style={{...buttonStyle, borderRight: '1px solid #ced4da'}} 
                        onClick={() => setValue(selectProps.options[0].options)}
                    >Seleziona tutte</button>
                </Grid.Col>
                <Grid.Col width={6} className="p-0">
                    <button type="button" style={buttonStyle} onClick={() => setValue([])}>Deseleziona tutte</button>
                </Grid.Col>
            </Grid.Row>
            <Grid.Row className="m-0">
                <Grid.Col width={2} className="p-0">
                    <span 
                        style={{...buttonStyle, borderRight: '1px solid #ced4da'}}
                    >Solo</span>
                </Grid.Col>
                <Grid.Col width={2} className="p-0">
                    <button
                        type="button" 
                        style={{...buttonStyle, borderRight: '1px solid #ced4da'}} 
                        onClick={() => setValue(selectProps.options[0].options.filter(section => +section.value[0] === 1))}
                    >1ª</button>
                </Grid.Col>
                <Grid.Col width={2} className="p-0">
                    <button 
                        type="button" 
                        style={{...buttonStyle, borderRight: '1px solid #ced4da'}} 
                        onClick={() => setValue(selectProps.options[0].options.filter(section => +section.value[0] === 2))}
                    >2ª</button>
                </Grid.Col>
                <Grid.Col width={2} className="p-0">
                    <button 
                        type="button" 
                        style={{...buttonStyle, borderRight: '1px solid #ced4da'}} 
                        onClick={() => setValue(selectProps.options[0].options.filter(section => +section.value[0] === 3))}
                    >3ª</button>
                </Grid.Col>
                <Grid.Col width={2} className="p-0">
                    <button 
                        type="button" 
                        style={{...buttonStyle, borderRight: '1px solid #ced4da'}} 
                        onClick={() => setValue(selectProps.options[0].options.filter(section => +section.value[0] === 4))}
                    >4ª</button>
                </Grid.Col>
                <Grid.Col width={2} className="p-0">
                    <button 
                        type="button" 
                        style={buttonStyle} 
                        onClick={() => setValue(selectProps.options[0].options.filter(section => +section.value[0] === 5))}
                    >5ª</button>
                </Grid.Col>
            </Grid.Row>
        </div>
    );

    return (
        <Select
            name={name}
            value={value}
            components={{ GroupHeading }}
            options={options}
            isMulti
            isSearchable
            styles={customStyle}
            placeholder={<span className="text-muted">Seleziona le classi</span>}
            className="basic-multi-select"
            closeMenuOnSelect={false}
            onChange={setValue}
			noOptionsMessage={() => 'Nessun risultato trovato'}
            hideSelectedOptions={false}
            {...rest}
        />
    );
};

export default Selector;