import React from 'react';
import StandaloneFormPage from '../../Admin/StandaloneFormPage/';
import FormCard from '../../Admin/FormCard/';

const LoginCard = ({ title, text }) => (
    <StandaloneFormPage imageURL={"https://www.tronweb.it/wp-content/uploads/2018/09/tw-logo.png"}>
        <FormCard RootComponent="div" title={title} text={text} className="mb-4 shadow-sm" />
    </StandaloneFormPage>
);
export default LoginCard;
