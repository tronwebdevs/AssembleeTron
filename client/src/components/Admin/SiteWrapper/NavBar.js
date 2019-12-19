import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Container,
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	Button
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import NavBarItems from "./NavBarItems";
import TWIcon from "./tw-icon.png";

const NavBar = ({ logout }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	return (
		<header>
			<Navbar color="white" light expand="md">
				<Container>
					<NavbarBrand
						tag={() => (
							<NavLink
								to={{ pathname: "/gestore" }}
								exact
								activeClassName="active"
							>
								<img
									style={{ height: "40px", width: "40px" }}
									src={TWIcon}
									alt="TronWeb Logo"
								/>
							</NavLink>
						)}
					/>
					<NavbarToggler onClick={toggle} />
					<Collapse isOpen={isOpen} navbar>
						<Nav className="ml-auto" navbar>
							{NavBarItems.map((item, index) => (
								<NavItem key={index}>
									<NavLink
										to={{ pathname: item.to }}
										className="nav-link"
										exact
										activeClassName="active"
										onClick={() =>
											window.innerWidth < 992
												? toggle()
												: null
										}
									>
										{item.value}
									</NavLink>
								</NavItem>
							))}
							<NavItem className="ml-lg-3">
								<Button color="danger" outline onClick={logout}>
									Logout
									<FaSignOutAlt className="ml-2" />
								</Button>
							</NavItem>
						</Nav>
					</Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

NavBar.propTypes = {
	logout: PropTypes.func.isRequired
};

export default NavBar;
