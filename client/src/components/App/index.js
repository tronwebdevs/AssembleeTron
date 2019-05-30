import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Error404Page } from "tabler-react";
import './index.css';

import store from '../../store';

import Admin from '../pages/Admin/';
import Student from '../pages/Student/';

const App = () => (
    <Provider store={store}>
        <BrowserRouter>
            <React.Fragment>
                <Switch>
                    <Route path="/gestore" component={Admin} />
                    <Route path="/" component={Student} />
                    <Route component={props => (
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
    </Provider>
);

export default App;