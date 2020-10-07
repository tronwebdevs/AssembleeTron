import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

import styled from 'styled-components';

const Wrapper = styled.div`
    .student-section-group {
        padding: 0;
    }

    .student-section-label {
        display: block;
        padding: 10px 14px;
        margin: 5px 0;
    }

    .student-section-checkbox {
        display: none
    }
`;

const StudentSectionRadio = ({ name = 'studentSection', label, value, checked, setFieldValue }) => (
    <Wrapper>
        <FormGroup 
            check 
            className="student-section-group"
            style={{ backgroundColor: checked === true ? '#343434' : '#232323' }}
        >
            <Label check className="student-section-label">
                <Input 
                    type="radio" 
                    name={name} 
                    checked={checked} 
                    value={value}
                    className="student-section-checkbox" 
                    onChange={() => setFieldValue(name, value)}
                />{' '}
                <span>{label[0]}</span>
                <div style={{display:'inline'}}>{label.slice(1)}</div>
            </Label>
        </FormGroup>
    </Wrapper>
);

export default StudentSectionRadio;