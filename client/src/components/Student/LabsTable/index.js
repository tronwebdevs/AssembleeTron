import React, { Component } from 'react';
import { Table } from 'reactstrap';
import LabTableRow from './LabTableRow';

class LabsTable extends Component {

    generateLabRows = () => {
        return this.props.labs.map((lab, index) => <LabTableRow key={index + 1} lab={lab} index={index + 1} />);
    }

    render() {
        const { labs } = this.props;

        if (labs.length > 0) {
            return (
                <Table responsive>
                    <thead>
                        <tr>
                            <th scope="col">Ora</th>
                            <th scope="col">Attività</th>
                            <th scope="col">Aula</th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {this.generateLabRows()}
                    </tbody>
                </Table>
            );
        } else {
            return (
                <div className="text-center font-weight-bold text-uppercase">
                    <span className="text-danger">Non partecipi all'assemblea</span>
                </div>
            );
        }
    }
}

export default LabsTable;