import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Admin from '../pages/Admin';
import Student from '../pages/Student/';
import Error from '../pages/Error/';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/gestore" component={Admin} />
                        <Route path="/" component={Student} />
                        <Route component={Error} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;