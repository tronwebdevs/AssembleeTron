import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

class Error extends Component {
    render() {
        const { code, message } = this.props;
        return (
            <div>
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <h1 className="text-muted display-1">{code}</h1>
                        <Card.Text>
                            <p>
                                {message}
                            </p>
                        </Card.Text>
                        <div className="text-center">
                            <Button variant="outline-primary">
                                <Link to="/">Home</Link>
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Error;