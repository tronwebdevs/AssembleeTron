const rootPath = '/gestore';

const NavBarItems = [
	{
		value: 'Home',
		to: rootPath + '/',
		icon: 'home'
	},
	{
		value: 'Informazioni',
		to: rootPath + '/informazioni',
		icon: 'info'
	},
	{
		value: 'Laboratori',
		to: rootPath + '/laboratori',
		icon: 'list'
	},
	{
		value: 'Studenti',
		to: rootPath + '/studenti',
		icon: 'users'
	},
	{
		value: 'Statistiche',
		to: rootPath + '/statistiche',
		icon: 'bar-chart-2'
	},
	{
		value: 'Esporta',
		to: rootPath + '/esporta',
		icon: 'download'
	}
];

export default NavBarItems;
