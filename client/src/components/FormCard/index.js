import React from 'react';
import { Card, Form } from 'tabler-react';
import './index.css';

const FormCard = ({ 
    children, 
    onSubmit, 
    action, 
    method, 
    title, 
    text,
    pAlign
}) => (
    <Form className="card" onSubmit={onSubmit} action={action} method={method}>
        <Card.Body className="p-6">
            <Card.Title style={{ fontSize: '1.3rem' }} className="text-center mb-0">{title}</Card.Title>
            <p className="card-text login-subtitle" style={{ textAlign: pAlign || 'left' }}>
                {text}
            </p>
            {children}
        </Card.Body>
    </Form>
);

export default FormCard;