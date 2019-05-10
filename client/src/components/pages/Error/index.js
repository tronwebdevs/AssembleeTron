import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardText, Button } from 'reactstrap';

class Error extends Component {
    render() {
        const { code, message } = this.props;
        return (
            <div>
                <Card className="mb-4 shadow-sm">
                    <CardBody>
                        <h1 className="text-muted display-1">{code}</h1>
                        <CardText>
                            <p>
                                {message}
                            </p>
                        </CardText>
                        <div className="text-center">
                            <Button variant="outline-primary">
                                <Link to="/">Home</Link>
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default Error;