import { NavLink, withRouter } from "react-router-dom";

const NavBarItems = [
    {
        value: "Home",
        to: "/gestore",
        icon: "home",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    },
    {
        value: "Informazioni",
        to: "/informazioni",
        icon: "info",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    },
    {
        value: "Laboratori",
        to: "/laboratori",
        icon: "list",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    },
    {
        value: "Studenti",
        to: "/studenti",
        icon: "users",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    }
];

export default NavBarItems;