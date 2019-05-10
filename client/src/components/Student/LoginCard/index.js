import React from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

const LoginCard = ({ title, text }) => (
    <div className="form-signin">
        <Card className="mb-4 shadow-sm">
            <CardBody className="text-center">
                <CardTitle className="mb-0">{title}</CardTitle>
                <CardText className="text-left">{text}</CardText>
            </CardBody>
        </Card>
    </div>
);
export default LoginCard;
