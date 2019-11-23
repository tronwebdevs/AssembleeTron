import React, { Fragment } from "react";
import { Container } from 'reactstrap';
import moment from 'moment';

const SiteWrapper = ({ children }) => (
    <Fragment>
        <Container>
            {children}
        </Container>
        <footer 
            style={{
                position: 'absolute',
                bottom: "0",
                width: "100%",
                height: "60px",
                lineHeight: "60px",
                backgroundColor: "#f5f5f5"
            }}
        >
            <Container className="text-center">
                <span className="text-muted">Copyright © {moment().format('YYYY') } <a href="https://www.tronweb.it"> TronWeb</a> | Made by Davide Testolin</span>
            </Container>
        </footer>
    </Fragment>
);

export default SiteWrapper;
