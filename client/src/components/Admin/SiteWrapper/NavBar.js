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
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import NavBarItems from "./NavBarItems";
import TWIcon from './tw-icon.png';

const NavBar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	return (
		<header>
			<Navbar color="white" light expand="md">
                <Container>
                    <NavbarBrand
                        tag={() => (
                            <NavLink to={{ pathname: '/gestore' }}>
                                <img style={{ height: '40px', width: '40px' }} src={TWIcon} alt="TronWeb Logo" />
                            </NavLink>
                        )}
                    />
                    <NavbarToggler onClick={toggle}/>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {NavBarItems.map((item, index) => (
                                <NavItem key={index}>
                                    <NavLink to={{ pathname: item.to}} className="nav-link">
                                        {item.value}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                    </Collapse>
                </Container>
			</Navbar>
		</header>
	);
};

export default NavBar;
