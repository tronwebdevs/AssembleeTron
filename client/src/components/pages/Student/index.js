import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Error404Page } from 'tabler-react';
import { StudentRoute } from '../../Student/';

import Home from './Home';
import LabsSelect from './LabsSelect';
import ShowSub from './ShowSub';

const Student = () => (
	<BrowserRouter>
        <React.Fragment>
			<Switch>
				<StudentRoute path="/" component={Home} exact />
				<StudentRoute path="/iscrizione" component={LabsSelect} exact />
				<StudentRoute path="/conferma" component={ShowSub} exact />
				<Route
					component={props => (
						<Error404Page
							action={'Indietro'}
							subtitle={'Oof... Pagina non trovata...'}
							details={
								'La pagina che stai cercando non è stata trovata'
							}
							{...props}
						/>
					)}
				/>
			</Switch>
        </React.Fragment>
	</BrowserRouter>
);

export default Student;
