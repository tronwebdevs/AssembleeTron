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
			<DefaultOption h={h + 1} />
			{labs.map((lab, index) =>
				lab.info[h].seats > 0 ? (
                    <Option key={index} lab={lab} h={h} />
				) : ''
			)}
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
