import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody, Button, Collapse } from "reactstrap";
import { FaChevronUp } from "react-icons/fa";
import LabShow from "./LabShow";
import posed from "react-pose";

const Box = posed.div({
	open: {
		rotate: 0,
		transition: {
			duration: 300
		}
	},
	close: {
		rotate: -180,
		transition: {
			duration: 300
		}
	}
});

const LabsListCard = ({ labs }) => {
	const [labsCollapse, setLabsCollapse] = useState(window.innerWidth > 999);
	return (
		<Card>
			<CardHeader onClick={() => setLabsCollapse(!labsCollapse)}>
				<b>Lista dei laboratori</b>
				{labsCollapse === false && window.innerWidth <= 999 ? (
					<small className="text-muted ml-2">
						(clicca per aprire)
					</small>
				) : null}
				<Button
					color="link"
					id="labsToggler"
					style={{
						position: "absolute",
						right: "10px"
					}}
				>
					<Box pose={labsCollapse ? "open" : "close"}>
						<FaChevronUp />
					</Box>
				</Button>
			</CardHeader>
			<Collapse isOpen={labsCollapse}>
				<CardBody>
					{labs.map((lab, index, labs) => (
						<LabShow
							key={index}
							title={lab.title}
							description={lab.description}
							borderBottom={index < labs.length - 1}
						/>
					))}
				</CardBody>
			</Collapse>
		</Card>
	);
};

LabsListCard.propTypes = {
	labs: PropTypes.array
};

export default LabsListCard;
