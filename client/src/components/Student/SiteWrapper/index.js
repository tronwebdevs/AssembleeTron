import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import {
    Site,
    Grid,
    Button,
    RouterContextProvider,
} from "tabler-react";
import moment from 'moment';
import "tabler-react/dist/Tabler.css";

const SiteWrapper = ({ children }) => (
    <Site.Wrapper
        headerProps={{
            href: "./",
            alt: "TronWeb Logo",
            imageURL: "https://www.tronweb.it/wp-content/uploads/2018/09/tw-logo.png"
        }}
        navProps={{ itemsObjects: [] }}
        routerContextComponentType={withRouter(RouterContextProvider)}
        footerProps={{
            copyright: (
                <Fragment>
                    Copyright © {moment().format('YYYY') } <a href="https://www.tronweb.it"> TronWeb</a>. Theme by Davide Testolin.
                    All rights reserved.
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
