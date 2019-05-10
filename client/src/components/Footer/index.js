import React from 'react';
import moment from 'moment';

const Footer = () => (
    <footer className="footer text-muted text-center text-small">
        <p className="mb-1">Copyright &copy; {moment().format('YYYY')} TronWeb | Davide Testolin | Made with Node.js</p>
    </footer>
);

export default Footer;
