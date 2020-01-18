import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Error404Page } from "tabler-react";
import posed, { PoseGroup } from "react-pose";

import { AuthRequired, SiteWrapper } from "../../Admin/";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Info from "./Info";
import Labs from "./Labs";
import Students from "./Students";
import Stats from "./Stats";
import Export from "./Export";
import DeleteAssembly from "./DeleteAssembly";
import CreateAssembly from "./CreateAssembly";
import RestrictedArea from "./RestrictedArea";

const rootPath = "/gestore";

const RouteContainer = posed.div({
    enter: { 
        opacity: 1, 
        beforeChildren: true,
        transition: { duration: 500 }
    },
    exit: { 
        opacity: 0, 
        transition: { duration: 500 }
    },
});

const getTitle = pathname => {
    let spt = pathname.split('/');
    let str = spt[spt.length - 1];
    if (str === '') {
        str = 'dashboard';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const AdminWrapper = () => (
    <Route
        render={({ location }) => (
            <SiteWrapper title={getTitle(location.pathname)}>
                <PoseGroup>
                    <RouteContainer key={location.key || 0}>
                        <Switch location={location}>
                            <AuthRequired
                                path={rootPath + "/"}
                                component={Dashboard}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/informazioni"}
                                component={Info}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/laboratori"}
                                component={Labs}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/studenti"}
                                component={Students}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/statistiche"}
                                component={Stats}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/esporta"}
                                component={Export}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/elimina"}
                                component={DeleteAssembly}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/crea"}
                                component={CreateAssembly}
                                exact
                            />
                            <AuthRequired
                                path={rootPath + "/restricted"}
                                component={RestrictedArea}
                                exact
                            />
                            <AuthRequired
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
                    </RouteContainer>
                </PoseGroup>
            </SiteWrapper>
        )}
    />
);

const Admin = () => (
	<BrowserRouter>
		<React.Fragment>
			<Switch>
				<Route path={rootPath + "/login"} component={Login} exact />
                <Route path={rootPath} component={AdminWrapper} />
			</Switch>
		</React.Fragment>
	</BrowserRouter>
);

export default Admin;
