import React from 'react';
import PropTypes from 'prop-types';
import StandaloneFormPage from '../StandaloneFormPage';
import FormCard from '../FormCard';
import TWIcon from './SiteWrapper/tw-icon.png';

const LoginCard = ({ title, text }) => (
    <StandaloneFormPage imageURL={TWIcon}>
        <FormCard RootComponent="div" title={title} text={text} />
    </StandaloneFormPage>
);

LoginCard.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default LoginCard;
