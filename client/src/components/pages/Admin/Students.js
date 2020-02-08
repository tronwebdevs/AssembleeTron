import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import { PageLoading, ListCard } from '../../Admin/';

const Students = ({ assembly }) => {
	const { pendings, stats } = assembly;
	const { students } = stats;

	if (pendings.assembly === false) {
		return (
			<Fragment>
				<Row>
					<ListCard
						title="Studenti sul database"
						items={[
							{
								title: 'Studenti totali: ',
								text: students,
								colSize: '5'
							}
						]}
						buttons={
							<Row>
								<Col xs="12" md="6">
									<Button
										block
										outline
										color="danger"
										onClick={() =>
											alert('Attualmente non disponibile')
										}
									>
										Elimina tutti
									</Button>
								</Col>
								<Col xs="12" md="6">
									<Button
										block
										outline
										color="success"
										onClick={() =>
											alert('Attualmente non disponibile')
										}
									>
										Carica
									</Button>
								</Col>
							</Row>
						}
					/>
				</Row>
			</Fragment>
		);
	} else {
		return <PageLoading />;
	}
};

Students.propTypes = {
	assembly: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps)(Students);
