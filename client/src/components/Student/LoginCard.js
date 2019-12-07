import React from "react";
import PropTypes from "prop-types";
import StandaloneFormPage from "../StandaloneFormPage";
import FormCard from "../FormCard";

const LoginCard = ({ title, subtitle, text }) => (
	<StandaloneFormPage>
        <FormCard 
            title={title} 
            subtitle={subtitle}
            text={text} 
            pAlign="center"
        />
	</StandaloneFormPage>
);

LoginCard.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
	text: PropTypes.string
};

export default LoginCard;
