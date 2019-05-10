import React from 'react';
import moment from 'moment';
import './index.css';

const Footer = () => (
    <footer className="footer text-muted text-center text-small">
        <p className="mb-1">Copyright &copy; {moment().format('YYYY')} TronWeb | Davide Testolin</p>
    </footer>
);

export default Footer;
