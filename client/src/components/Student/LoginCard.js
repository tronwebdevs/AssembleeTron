import React from 'react';
import PropTypes from 'prop-types';
import StandaloneFormPage from '../StandaloneFormPage';
import FormCard from '../FormCard';

const LoginCard = ({ title, text }) => (
    <StandaloneFormPage>
        <FormCard title={title} text={text} />
    </StandaloneFormPage>
);

LoginCard.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string
};

export default LoginCard;
