import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard';
import { Error404Page } from "tabler-react";

class Admin extends Component {
    render() {
        return (
            <BrowserRouter>
                <>
                    <Switch>
                        <Route path="/gestore/" component={Dashboard} exact />
                        <Route component={props => <Error404Page action={'Indietro'} subtitle={'Oof... Pagina non trovata...'} details={'La pagina che stai cercando non è stata trovata'} {...props} />} />
                    </Switch>
                </>
            </BrowserRouter>
        );
    }
}


export default Admin;