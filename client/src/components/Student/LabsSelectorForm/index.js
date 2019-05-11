import React, { Component } from 'react';
import { Row, Col, Form, FormGroup, Button } from 'reactstrap';
import LabSelector from './LabSelector';

class LabsSelectorForm extends Component {

    state = {
        validated: false,
        h1Valid: true,
        h2Valid: true,
        h3Valid: true,
        h4Valid: true,
        h1: '',
        h2: '',
        h3: '',
        h4: ''
    }

    validate = () => {
        const selects = [ ...document.getElementsByClassName('select-lab') ];
        selects.forEach((el, index) => {
            if (el.options[el.selectedIndex].getAttribute('data-twoh') === 'true') {
                if (index % 2 === 0) {
                    if (el.value === selects[index + 1].value) {
                        this.setState({ [selects[index + 1].name + 'Valid']: true });
                    } else {
                        document.getElementById('if-' + selects[index + 1].name).innerText = 'Questo laboratorio deve essere uguale a quello dell\'ora precedente (2 ore)';
                        this.setState({ [selects[index + 1].name + 'Valid']: false });
                    }
                } else {
                    if (el.value === selects[index - 1].value) {
                        this.setState({ [selects[index - 1].name + 'Valid']: true });
                    } else {
                        document.getElementById('if-' + selects[index - 1].name).innerText = 'Questo laboratorio deve essere uguale a quello dell\'ora successiva (2 ore)';
                        this.setState({ [selects[index - 1].name + 'Valid']: false });
                    }
                }
            }
        });
        this.setState({ validated: true });
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmit = event => {
        event.preventDefault();
        this.setState({ validated: false });
        this.validate();
    }

    render() {
        const { labs } = this.props;
        return (
            <Row className="mb-2">
                <Col>
                    <Form className="row" onSubmit={this.onSubmit}>
                        {[1, 2, 3, 4].map(h => <LabSelector key={h} labs={labs} h={h} onChange={this.onChange} valid={this.state['h' + h + 'Valid']} validated={this.state.validated} />)}
                        <Col className="text-center">
                            <FormGroup className="mt-3 mb-0">
                                <Button type="submit" color="primary">Iscriviti</Button>
                            </FormGroup>
                        </Col>
                    </Form>
                </Col>
            </Row>
        )
    }
}

export default LabsSelectorForm;