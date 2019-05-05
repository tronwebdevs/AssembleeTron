import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthRoute from '../../AuthRoute/';

import Login from './Login';
import LabsSelect from './LabsSelect';
import Error from '../Error/';

class Student extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/" component={Login} exact />
                        <Route path="/iscrizione" component={LabsSelect} />
                        <Route component={Error} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}


export default Student;