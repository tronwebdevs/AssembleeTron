import React from 'react';
import { Col, FormGroup, CustomInput, FormFeedback } from 'reactstrap';

import DefaultOption from './DefaultOption';
import Option from './Option';

const LabSelector = ({ labs, h, onChange, valid, validated }) => (
    <Col sm={6} className="my-md-1">
        <FormGroup className="mb-2">
            <CustomInput
                type="select"
                className="select-lab"
                name={'h' + h}
                id={'selectorH' + h}
                onChange={onChange}
                defaultValue="default"
                valid={validated === true && valid === true ? true : false}
                invalid={validated === true && valid === false ? true : false}
            >
                <DefaultOption h={h} />
                {
                    labs.map((lab, index) => {
                        if (lab['seatsH' + h] > 0) {
                            return <Option key={index} lab={lab} h={h} />
                        } else {
                            return '';
                        }
                    })
                }
            </CustomInput>
            <FormFeedback className="text-left" id={'if-h' + h}></FormFeedback>
        </FormGroup>
    </Col>
);

export default LabSelector;