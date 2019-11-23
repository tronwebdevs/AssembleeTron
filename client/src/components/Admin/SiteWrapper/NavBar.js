import React, { useState } from "react";
import {
	Container,
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem
} from "reactstrap";
import { NavLink } from "react-router-dom";
import NavBarItems from './NavBarItems';

const NavBar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	return (
		<div>
			<Navbar color="light" light expand="md">
                <Container>
                    <NavbarBrand href="/">tronweb</NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            {NavBarItems.map(item => (
                                <NavItem>
                                    <NavLink to={{pathname: item.to}}>{item.value}</NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                    </Collapse>
                </Container>
			</Navbar>
		</div>
	);
};

export default NavBar;
