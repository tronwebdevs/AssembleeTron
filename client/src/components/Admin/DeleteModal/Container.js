import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

const Container = ({ text, deleteFunc, open }) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => setVisible(true), [open]);

	return (
		<Modal
			visible={visible}
			showModal={setVisible}
            text={text}
            deleteFunc={deleteFunc}
		/>
	);
};

Container.propTypes = {
	text: PropTypes.string.isRequired,
    deleteFunc: PropTypes.func.isRequired,
    open: PropTypes.number.isRequired
};

export default Container;
