import React from 'react';
import { Container } from 'reactstrap';
import moment from 'moment';

const Footer = () => (
	<footer>
		<Container className="text-center">
			<span className="footer-span">
				Copyright © {moment().format('YYYY')}{' '}
				<a href="https://www.tronweb.it"> TronWeb</a> | Made by Davide
				Testolin
			</span>
		</Container>
	</footer>
);

export default Footer;
