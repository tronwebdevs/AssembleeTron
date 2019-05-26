import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Error404Page } from "tabler-react";

import Login from './Login';
import Dashboard from './Dashboard';

const rootPath = '/gestore';

const Admin = props => (
    <BrowserRouter>
        <>
            <Switch>
                <Route path={rootPath + "/"} component={Dashboard} exact />
                <Route path={rootPath + "/login"} component={Login} exact />
                <Route component={props => <Error404Page action={'Indietro'} subtitle={'Oof... Pagina non trovata...'} details={'La pagina che stai cercando non è stata trovata'} {...props} />} />
            </Switch>
        </>
    </BrowserRouter>
);

export default Admin;