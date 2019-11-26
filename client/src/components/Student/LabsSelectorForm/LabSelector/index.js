import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Input, FormFeedback } from "reactstrap";

import DefaultOption from "./DefaultOption";
import Option from "./Option";

const LabSelector = ({ labs, h, onChange, value, error }) => (
	<FormGroup className="mb-3">
		<Input
			type="select"
			className="select-lab"
			name={"h" + h}
			id={"selectorH" + h}
			onChange={onChange}
			value={value}
			invalid={error !== undefined}
		>
			<DefaultOption h={h} />
			{labs.map((lab, index) => {
				if (lab.info["h" + h].seats > 0) {
					return <Option key={index} lab={lab} h={h} />;
				} else {
					return "";
				}
			})}
		</Input>
		<FormFeedback>{error}</FormFeedback>
	</FormGroup>
);

LabSelector.propTypes = {
	labs: PropTypes.array.isRequired,
	h: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	error: PropTypes.string
};

export default LabSelector;
