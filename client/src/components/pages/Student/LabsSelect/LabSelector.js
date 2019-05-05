import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Col } from 'react-bootstrap';

class LabSelector extends Component {

    renderLabel = () => {
        switch(this.props.h) {
            case 1:
                return 'Prima Ora';
            case 2:
                return 'Prima Ora';
            case 3:
                return 'Prima Ora';
            case 4:
                return 'Prima Ora';
            default:
                return '';
        }
    }
    
    renderOptions = () => {
        const { h, assembly } = this.props;
        const { avabile_labs } = assembly;
        return avabile_labs.map(lab => (
            <option key={lab.ID} value={lab.ID} data-twoh={lab.lastsTwoH}>{lab.title} - {lab["seatsH" + h]} posti rimanenti</option>
        ));
    }

    render() {
        const { h } = this.props;
        return (
            <Col sm={6} className="my-md-1">
                <Form.Group className="mb-2">
                    <Form.Control as="select" className="select-lab" name={'h' + h}>
                        <option value="default" defaultValue disabled>{this.renderLabel()}</option>
                        {this.renderOptions()}
                    </Form.Control>
                    <Form.Control.Feedback className="text-left" id={'if-h' + h}></Form.Control.Feedback>
                </Form.Group>
            </Col>
        )
    }
}

const mapStateToProps = state => ({
    assembly: state.assembly
});

export default connect(mapStateToProps)(LabSelector);