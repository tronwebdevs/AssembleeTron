import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Site, RouterContextProvider } from "tabler-react";
import moment from 'moment';
import "tabler-react/dist/Tabler.css";
import "./index.css";

const SiteWrapper = ({ children }) => (
    <span className="student-wrapper">
        <Site.Wrapper
            headerProps={{
                className: "student",
                href: "./",
                alt: "TronWeb Logo",
                imageURL: "https://www.tronweb.it/wp-content/uploads/2018/09/tw-logo.png"
            }}
            navProps={{ itemsObjects: []}}
            routerContextComponentType={withRouter(RouterContextProvider)}
            footerProps={{
                copyright: (
                    <Fragment>
                        Copyright © {moment().format('YYYY') } <a href="https://www.tronweb.it"> TronWeb</a> | Made by Davide Testolin
                    </Fragment>
                )
            }}
        >
            {children}
        </Site.Wrapper>
    </span>
);

export default SiteWrapper;
