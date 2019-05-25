import React from 'react';
import PropTypes from 'prop-types';
import StandaloneFormPage from '../../StandaloneFormPage';
import FormCard from '../../FormCard';

const LoginCard = ({ title, text }) => (
    <StandaloneFormPage imageURL={"https://www.tronweb.it/wp-content/uploads/2018/09/tw-logo.png"}>
        <FormCard RootComponent="div" title={title} text={text} />
    </StandaloneFormPage>
);

LoginCard.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default LoginCard;
