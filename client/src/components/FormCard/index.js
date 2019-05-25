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
    RootComponent 
}) => (
    <Form className="card" RootComponent={RootComponent || 'form'} onSubmit={onSubmit} action={action} method={method}>
        <Card.Body className="p-6">
            <Card.Title RootComponent="h6" className="text-center mb-0">{title}</Card.Title>
            <p className="card-text text-left login-subtitle">
                {text}
            </p>
            {children}
        </Card.Body>
    </Form>
);

export default FormCard;