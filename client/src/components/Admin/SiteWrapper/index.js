import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../../actions/adminActions";

import "tabler-react/dist/Tabler.css";
import "./c3jscustom.css";

import NavBar from "./NavBar";
import PageContent from "./PageContent";
import Footer from "../../Footer";

const SiteWrapper = ({ logout, title, children }) => (
	<Fragment>
		<NavBar logout={logout} />
		<PageContent title={title}>{children}</PageContent>
		<Footer />
	</Fragment>
);

SiteWrapper.propTypes = {
	logout: PropTypes.func.isRequired
};

export default connect(() => ({}), { logout })(SiteWrapper);
