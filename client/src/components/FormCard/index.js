import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, CardBody, Alert, Form } from 'reactstrap';
import './index.css';

const FormCard = ({ 
    children, 
    onSubmit, 
    action, 
    method, 
    title, 
    text,
    pAlign,
    errorMessage
}) => (
    <Form className="card" onSubmit={onSubmit} action={action} method={method}>
        {errorMessage ? (
            <Alert 
                color="danger" 
                className="text-center" 
                style={{ 
                    borderRadius: '3px 3px 0 0 ',
                    margin: '-1px'
                }}
            >{errorMessage}</Alert> 
        ) : null}
        <CardBody className="p-6">
            <CardTitle style={{ fontSize: '1.3rem' }} className="text-center mb-0">{title}</CardTitle>
            <p className="card-text login-subtitle" style={{ textAlign: pAlign || 'left' }}>
                {text}
            </p>
            {children}
        </CardBody>
    </Form>
);

FormCard.propTypes = {
    children: PropTypes.array,
    onSubmit: PropTypes.func, 
    action: PropTypes.string, 
    method: PropTypes.string, 
    title: PropTypes.string.isRequired, 
    text: PropTypes.string,
    pAlign: PropTypes.string,
    errorMessage: PropTypes.string
};

export default FormCard;