import React from "react";
import { Container } from "reactstrap";
import moment from "moment";

const Footer = () => (
	<footer
		style={{
			height: "60px",
			lineHeight: "60px",
			backgroundColor: "#f5f5f5"
		}}
	>
		<Container className="text-center">
			<span className="text-muted">
				Copyright © {moment().format("YYYY")}{" "}
				<a href="https://www.tronweb.it"> TronWeb</a> | Made by Davide
				Testolin
			</span>
		</Container>
	</footer>
);

export default Footer;
