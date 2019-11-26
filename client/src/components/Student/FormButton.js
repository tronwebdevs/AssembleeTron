import React from "react";
import PropTypes from "prop-types";
import { Button, Spinner } from "reactstrap";

const FormButton = ({ text, isSubmitting }) => (
	<Button type="submit" color="primary" block={true} disabled={isSubmitting}>
		{isSubmitting ? <Spinner color="light" size="sm" /> : text}
	</Button>
);

FormButton.propTypes = {
	text: PropTypes.string.isRequired,
	isSubmitting: PropTypes.bool.isRequired
};

export default FormButton;
