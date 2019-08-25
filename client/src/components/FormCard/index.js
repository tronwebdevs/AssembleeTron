import React from 'react';
import PropTypes from 'prop-types';
import { Card, Form } from 'tabler-react';
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
    {errorMessage ? <Card.Alert color="danger" className="text-center">{errorMessage}</Card.Alert> : null}
        <Card.Body className="p-6">
            <Card.Title style={{ fontSize: '1.3rem' }} className="text-center mb-0">{title}</Card.Title>
            <p className="card-text login-subtitle" style={{ textAlign: pAlign || 'left' }}>
                {text}
            </p>
            {children}
        </Card.Body>
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