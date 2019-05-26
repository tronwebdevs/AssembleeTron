import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Site, Grid, Button, RouterContextProvider } from "tabler-react";
import moment from 'moment';
import "tabler-react/dist/Tabler.css";
import './c3jscustom.css';

import NavBarItems from './NavBarItems';
import AccountDropdown from './AccountDropdown';

const SiteWrapper = ({ children }) => (
    <Site.Wrapper
        headerProps={{
            href: "/gestore",
            alt: "TronWeb Logo",
            imageURL: "https://www.tronweb.it/wp-content/uploads/2018/09/tw-logo.png",
            accountDropdown: AccountDropdown,
        }}
        navProps={{
            itemsObjects: NavBarItems,
            rightColumnComponent: (
                <NavLink to='/gestore/assemblea?elimina'>
                    <Button color="outline-danger" size="sm">
                        Elimina
                    </Button>
                </NavLink>
            )
        }}
        routerContextComponentType={withRouter(RouterContextProvider)}
        footerProps={{
            copyright: (
                <Fragment>
                    Copyright © {moment().format('YYYY') } <a href="https://www.tronweb.it"> TronWeb</a> | Made by Davide Testolin
                </Fragment>
            ),
            nav: (
                <Fragment>
                    <Grid.Col auto={true}>
                        <Button
                            href="mailto://direzione.tronweb@gmail.com"
                            size="sm"
                            outline
                            color="primary"
                            RootComponent="a"
                        >
                            Aiuto
                        </Button>
                    </Grid.Col>
                </Fragment>
            ),
        }}
    >
        {children}
    </Site.Wrapper>
);

export default SiteWrapper;
