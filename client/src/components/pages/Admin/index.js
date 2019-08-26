import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Error404Page } from "tabler-react";

import { AuthRequired } from '../../Admin/';
import Login from './Login';
import Dashboard from './Dashboard';
import Info from './Info';
import Labs from './Labs';
import Students from './Students';
import Stats from './Stats';
import DeleteAssembly from './DeleteAssembly';
import CreateAssembly from './CreateAssembly';

const rootPath = '/gestore';

const Admin = () => (
    <BrowserRouter>
        <React.Fragment>
            <Switch>
                <AuthRequired path={rootPath + "/"} component={Dashboard} exact />
                <AuthRequired path={rootPath + "/informazioni"} component={Info} exact />
                <AuthRequired path={rootPath + "/laboratori"} component={Labs} exact />
                <AuthRequired path={rootPath + "/studenti"} component={Students} exact />
                <AuthRequired path={rootPath + "/statistiche"} component={Stats} exact />
                <AuthRequired path={rootPath + "/elimina"} component={DeleteAssembly} exact />
                <AuthRequired path={rootPath + "/crea"} component={CreateAssembly} exact />
                <Route path={rootPath + "/login"} component={Login} exact /> 
                <AuthRequired component={props => (
                    <Error404Page 
                        action={'Indietro'} 
                        subtitle={'Oof... Pagina non trovata...'} 
                        details={'La pagina che stai cercando non è stata trovata'} 
                        {...props}
                    />
                )} />
            </Switch>
        </React.Fragment>
    </BrowserRouter>
);

export default Admin;