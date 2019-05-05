import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../../store';

import Admin from '../pages/Admin';
import Student from '../pages/Student/';
import Error from '../pages/Error/';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <>
                        <Switch>
                            <Route path="/gestore" component={Admin} />
                            <Route path="/" component={Student} />
                            <Route component={Error} />
                        </Switch>
                    </>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;