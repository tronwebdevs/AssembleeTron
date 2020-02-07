import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';

const PageTitle = ({ title }) => (
	<Col className="text-center">
		<h1
			className="my-4"
			style={{
				fontSize: '2rem'
			}}
		>
			{title}
		</h1>
	</Col>
);

PageTitle.propTypes = {
	title: PropTypes.string.isRequired
};

export default PageTitle;
