import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Row } from "reactstrap";
import {
	LabsTable,
	Badge,
	NotPartCard,
	PageTitle,
	SiteWrapper
} from "../../Student/";
import moment from "moment";

const ConfirmSub = ({ student, assembly }) => {
	const { profile, labs } = student;

	if (profile.studentId === null) {
		return <Redirect to={{ pathname: "/" }} />;
	} else if (labs.length === 0) {
		return <Redirect to={{ pathname: "/iscrizione" }} />;
	}

	const { date } = assembly.info;
	const notSub = labs.every(labID => labID === -1);

	return (
		<SiteWrapper>
			<Row>
				<PageTitle
					title={
						"Iscrizioni per l'Assemblea d'Istituto del " +
						moment(date).format("DD/MM/YYYY")
					}
				/>
			</Row>
			<Row>
				<Badge student={profile} lg={{ size: "4", offset: "4" }} />
			</Row>
			{notSub ? <NotPartCard /> : <LabsTable labs={labs} />}
		</SiteWrapper>
	);
};

ConfirmSub.propTypes = {
	student: PropTypes.object.isRequired,
	assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	student: state.student,
	assembly: state.assembly
});

export default connect(mapStateToProps)(ConfirmSub);
