import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePdf } from '../../../actions/assemblyActions';
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Button,
	Spinner
} from 'reactstrap';
import { PageLoading, BackupsTable, deleteModal } from '../../Admin/';
import { FaTrash } from 'react-icons/fa';
import cogoToast from 'cogo-toast';
import axios from 'axios';
import moment from 'moment';

const Export = ({ admin, assembly, generatePdf }) => {
    const { pendings, info } = assembly;

	const requestPdf = () =>
		pendings.generate_pdf !== true
			? generatePdf()
					.then(message => cogoToast.success(message))
					.catch(err => cogoToast.error(err.message))
			: null;

	if (pendings.assembly === false) {
		let enableExport = false;
		if (assembly.exists) {
			enableExport = moment().diff(moment(info.subscription.close)) > 0;
		}
		return (
			<Fragment>
				<Row>
					<Col xs="12" lg="6">
						<Card>
							<CardHeader>
								<b>PDF</b>
							</CardHeader>
							<CardBody>
								<p>
									Genera PDF degli iscritti all'assemblea per
									la security (operazione possibile solo al
									termine delle iscrizioni)
								</p>
								<Button
									color="primary"
									onClick={requestPdf}
									disabled={
										pendings.generate_pdf === true ||
										enableExport === false
									}
								>
									{pendings.generate_pdf === true ? (
										<Spinner color="light" size="sm" />
									) : (
										'Genera PDF'
									)}
								</Button>
							</CardBody>
						</Card>
					</Col>
					<Col xs="12" lg="6">
						<Card>
							<CardHeader>
								<b>JSON</b>
							</CardHeader>
							<CardBody>
								<p>
									Backup presenti sul server delle assemblee passate
								</p>
							</CardBody>
							<BackupsTable
								authToken={admin.token}
								button={{
									outline: true,
									color: 'danger',
                                    handleClick: (e, backup, setBackups) =>
                                        deleteModal(
                                            `Vuoi davvero eliminare il backup di "${backup.title}"?`,
                                            () =>
                                                axios
                                                    .delete('/api/assembly/backups', {
                                                        data: {
                                                            fileName: backup.fileName
                                                        },
                                                        headers: {
                                                            Authorization: `Bearer ${admin.token}`
                                                        }
                                                    })
                                                    .then(({ data }) => {
                                                        if (data && data.code === 1) {
                                                            setBackups(null);
                                                            cogoToast.success('Backup eliminato con successo');
                                                        } else {
                                                            throw new Error(data.message || 'Errore sconosciuto');
                                                        }
                                                    })
                                                    .catch(err => {
                                                        const { response } = err;
                                                        if (
                                                            response &&
                                                            response.data &&
                                                            response.data.message
                                                        ) {
                                                            err.message = response.data.message;
                                                        }
                                                        cogoToast.error(err.message);
                                                    })
                                        ),
									label: <FaTrash />
                                }}
							/>
						</Card>
					</Col>
				</Row>
			</Fragment>
		);
	} else {
		return <PageLoading />;
	}
};

Export.propTypes = {
	assembly: PropTypes.object.isRequired,
	generatePdf: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	admin: state.admin,
	assembly: state.assembly
});

export default connect(mapStateToProps, { generatePdf })(Export);
