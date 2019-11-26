import React, { Fragment } from "react";
import { Container } from "reactstrap";
import Footer from "../Footer";

const SiteWrapper = ({ children }) => (
	<Fragment>
		<Container style={{ minHeight: "calc(100% - 60px)" }}>
			{children}
		</Container>
		<Footer />
	</Fragment>
);

export default SiteWrapper;
