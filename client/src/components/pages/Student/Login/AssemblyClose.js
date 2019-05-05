import React from 'react';
import { Card } from 'react-bootstrap';

export default function AssemblyClose() {
    return (
        <div className="form-signin">
            <Card className="mb-4 shadow-sm">
                <Card.Title>{this.props.message}</Card.Title>
            </Card>
        </div>
    )
}
