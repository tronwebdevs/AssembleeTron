import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AuthRoute from '../../AuthRoute/';

import Login from './Login/';
import LabsSelect from './LabsSelect/';
import ConfirmSub from './ConfirmSub';
import Error from '../Error/';

class Student extends Component {
    render() {
        return (
            <BrowserRouter>
                <>
                    <Switch>
                        <Route path="/" component={Login} exact />
                        <AuthRoute path="/iscrizione" component={LabsSelect} />
                        <AuthRoute path="/conferma" component={ConfirmSub} />
                        <Route component={Error} />
                    </Switch>
                </>
            </BrowserRouter>
        );
    }
}


export default Student;