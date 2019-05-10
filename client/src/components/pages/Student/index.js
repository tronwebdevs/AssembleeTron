import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './Login';
import LabsSelect from './LabsSelect';
import ConfirmSub from './ConfirmSub';
import Error from '../Error/';

class Student extends Component {
    render() {
        return (
            <BrowserRouter>
                <>
                    <Switch>
                        <Route path="/" component={Login} exact />
                        <Route path="/iscrizione" component={LabsSelect} exact />
                        <Route path="/conferma" component={ConfirmSub} exact />
                        <Route component={Error} />
                    </Switch>
                </>
            </BrowserRouter>
        );
    }
}


export default Student;