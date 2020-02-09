import React from 'react';
import ReactDOM from 'react-dom';
import Container from './Container';

let open = 1;

const deleteModal = (text, deleteFunc) => {
	let rootContainer = document.getElementById('deleteLabModal');
	if (!rootContainer) {
		rootContainer = document.createElement('div');
		rootContainer.id = 'deleteLabModal';
		document.body.appendChild(rootContainer);
	}
	ReactDOM.render(
		<Container
            text={text}
			deleteFunc={deleteFunc}
			open={open === 1 ? --open : ++open}
		/>,
		rootContainer
	);
};

export default deleteModal;
