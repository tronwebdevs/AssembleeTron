import { NavLink, withRouter } from "react-router-dom";

const rootPath = '/gestore';

const NavBarItems = [
    {
        value: "Home",
        to: rootPath + "/",
        icon: "home",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    },
    {
        value: "Informazioni",
        to: rootPath + "/informazioni",
        icon: "info",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    },
    {
        value: "Laboratori",
        to: rootPath + "/laboratori",
        icon: "list",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    },
    {
        value: "Studenti",
        to: rootPath + "/studenti",
        icon: "users",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    },
    {
        value: "Statistiche",
        to: rootPath + "/statistiche",
        icon: "bar-chart-2",
        LinkComponent: withRouter(NavLink),
        useExact: true,
    }
];

export default NavBarItems;