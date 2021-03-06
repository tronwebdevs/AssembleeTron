import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	logout,
	fetchAvabileLabs,
	subscribeLabs
} from '../../../actions/studentActions';
import { Redirect } from 'react-router-dom';
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Alert,
	Button
} from 'reactstrap';
import {
	Badge,
	LabsSelectorForm,
	PageTitle,
	SiteWrapper,
	LabsListCard
} from '../../Student/';
import moment from 'moment';

const LabsSelect = ({
	assembly,
	student,
	fetchAvabileLabs,
	subscribeLabs,
	logout
}) => {
    const { profile, labs, labs_avabile, pendings } = student;
    const { info } = assembly;

	const [globalError, setGlobalError] = useState(null);

	if (profile.studentId === null) {
		return <Redirect to={{ pathname: '/' }} />;
	} else if (labs !== null) {
		return <Redirect to={{ pathname: '/conferma' }} />;
	}

	if (pendings.profile === undefined && pendings.labs_avabile === undefined) {
		fetchAvabileLabs().catch(({ message }) => setGlobalError(message));
	}

	if (assembly.pendings.info === false) {
        if (!info.subscription ||
            !info.subscription.open ||
            !info.subscription.close ||
            moment(info.subscription.open).diff(moment()) > 0 ||
            moment(info.subscription.close).diff(moment()) < 0
        ) {
            logout();
        }

		return (
			<SiteWrapper>
				<Row>
					<PageTitle title="Laboratori" />
				</Row>
				<Row>
					<Col xs="12" lg="8">
						{window.innerWidth <= 999 ? (
							<Row>
								<Badge student={profile} />
							</Row>
						) : null}
						<LabsListCard labs={labs_avabile} />
					</Col>
					<Col xs="12" lg="4">
						<div style={{ position: 'sticky', top: '1.5rem' }}>
							<Row>
								{window.innerWidth > 999 ? (
									<Badge student={profile} />
								) : null}
								<Col xs="12">
									<Card>
										<CardHeader>
											<b>Scegli i laboratori</b>
										</CardHeader>
										{globalError ? (
											<Alert
												color="danger"
												style={{ borderRadius: '0' }}
											>
												Errore: {globalError}
											</Alert>
										) : (
											''
										)}
										<CardBody>
											<u
												className="d-block mb-4"
												style={{ fontSize: '0.9em' }}
											>
												Per i progetti da <b>due ore</b>{' '}
												seleziona la prima e la seconda
												ora o la terza e la quarta ora.
											</u>
											<LabsSelectorForm
												labs={labs_avabile}
												subscribeLabs={subscribeLabs}
												fetchAvabileLabs={
													fetchAvabileLabs
												}
												profile={profile}
												tot_h={info.tot_h}
												setGlobalError={msg =>
													setGlobalError(msg)
												}
											/>
										</CardBody>
									</Card>
								</Col>
								<Col xs="12 mb-4">
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
						</div>
					</Col>
				</Row>
			</SiteWrapper>
		);
	} else {
		return <Fragment></Fragment>;
	}
};

LabsSelect.propTypes = {
	student: PropTypes.object.isRequired,
    assembly: PropTypes.object.isRequired,
	fetchAvabileLabs: PropTypes.func.isRequired,
	subscribeLabs: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	student: state.student,
	assembly: state.assembly
});

export default connect(mapStateToProps, {
	fetchAvabileLabs,
	subscribeLabs,
	logout
})(LabsSelect);
