import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../../actions/studentActions";
import { Redirect } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import {
	LabsTable,
	Badge,
	NotPartCard,
	PageTitle,
	SiteWrapper
} from "../../Student/";

const ConfirmSub = ({ student, assembly, logout }) => {
	const { profile, labs } = student;

	if (profile.studentId === null) {
		return <Redirect to={{ pathname: "/" }} />;
	} else if (labs.length === 0) {
		return <Redirect to={{ pathname: "/iscrizione" }} />;
	}

	const { title } = assembly.info;
	const notSub = labs.every(labID => labID === -1);

    if (assembly.pendings.info === false) {

        return (
            <SiteWrapper>
                <Row>
                    <PageTitle
                        title={`Iscrizioni per l'${title}`}
                    />
                </Row>
                <Row>
                    <Badge student={profile} lg={{ size: "4", offset: "4" }} />
                </Row>
                {notSub ? <NotPartCard /> : <LabsTable labs={labs} logout={logout}/>}
                {notSub ? (
                    <Row>
                        <Col xs="12">
                            <Button
                                outline
                                block
                                color="danger"
                                onClick={() => logout()}
                            >
                                Esci
                            </Button>
                        </Col>
                    </Row>
                ): null}
            </SiteWrapper>
        );
    } else {
        return <Fragment></Fragment>;
    }
};

ConfirmSub.propTypes = {
	student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	student: state.student,
	assembly: state.assembly
});

export default connect(mapStateToProps, { logout })(ConfirmSub);
