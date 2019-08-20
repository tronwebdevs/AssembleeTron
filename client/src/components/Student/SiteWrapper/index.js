import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Site, RouterContextProvider } from "tabler-react";
import moment from 'moment';
import "tabler-react/dist/Tabler.css";
import "./index.css";
import TWIcon from './tw-icon.png';

const SiteWrapper = ({ children }) => (
    <span className="student-wrapper">
        <Site.Wrapper
            headerProps={{
                className: "student",
                href: "./",
                alt: "TronWeb Logo",
                imageURL: TWIcon,
                align: 'center'
            }}
            navProps={{ 
                itemsObjects: [],
                style: { display: 'none' }
            }}
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
