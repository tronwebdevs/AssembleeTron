import React from 'react';
import { Card } from 'react-bootstrap';

const LoginCard = ({ title, text }) => (
    <div className="form-signin">
        <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
                <Card.Title>{title}</Card.Title>
                <Card.Text className="text-left">{text}</Card.Text>
            </Card.Body>
        </Card>
    </div>
);
export default LoginCard;
