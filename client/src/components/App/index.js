import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { Error404Page } from "tabler-react";
import "./index.css";

import store from "../../store";

import Admin from "../pages/Admin/";
import Student from "../pages/Student/";

let history = createBrowserHistory();
history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
});

const App = () => (
	<Provider store={store}>
		<Router history={history}>
			<React.Fragment>
				<Switch>
					<Route path="/gestore" component={Admin} />
					<Route path="/" component={Student} />
					<Route
						component={props => (
							<Error404Page
								action={"Indietro"}
								subtitle={"Oof... Pagina non trovata..."}
								details={
									"La pagina che stai cercando non è stata trovata"
								}
								{...props}
							/>
						)}
					/>
				</Switch>
			</React.Fragment>
		</Router>
	</Provider>
);

export default App;
