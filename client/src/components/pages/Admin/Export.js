import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { generatePdf } from "../../../actions/assemblyActions";
import { 
    Row, 
    Col, 
    Card, 
    CardHeader, 
    CardBody, 
    Button, 
    Spinner,
    Table
} from "reactstrap";
import { PageLoading, AdminAlert } from "../../Admin/";
import { FaTrash } from "react-icons/fa";
import moment from "moment";
import axios from "axios";

const Export = ({ admin, assembly, generatePdf }) => {
    const { pendings, info } = assembly;

    const [displayMessage, setDisplayMessage] = useState({
		type: null,
		message: null
    });
    const [backups, setBackups] = useState([]);
    const authToken = admin.token;

	useEffect(() => {
		async function fetchBackups() {
			const resp = await axios.get("/api/assembly/backups", {
				headers: { Authorization: `Bearer ${authToken}` }
			});
			const { data, response } = resp;
			if (data && data.code === 1) {
				setBackups(data.backups);
			} else {
				let errorMessage = "Errore inaspettato";
				if (response && response.data && response.data.message) {
					errorMessage = response.data.message;
				}
				setDisplayMessage({ type: "danger" , message: errorMessage });
			}
        }
        if (backups.length === 0) {
            fetchBackups();
        }
	}, [setDisplayMessage, authToken, backups]);
    
    const requestPdf = () => pendings.generate_pdf !== true ?
        generatePdf()
            .then(message => 
                setDisplayMessage({
                    type: "success",
                    message
                })
            )
            .catch(err => 
                setDisplayMessage({
                    type: "danger",
                    message: err.message
                })
            )
        : null;

    if (pendings.assembly === false) {
        let enableExport = false;
        if (assembly.exists) {
            enableExport = moment().diff(moment(info.subscription.close)) > 0;
        }
        return (
            <Fragment>
                <AdminAlert
                    display={displayMessage.message !== null}
                    message={displayMessage.message}
                    type={displayMessage.type}
                />
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <b>PDF</b>
                            </CardHeader>
                            <CardBody>
                                <p>
                                    Genera PDF degli iscritti all'assemblea per la security 
                                    (operazione possibile solo al termine delle iscrizioni)
                                </p>
                                <Button
                                    color="primary"
                                    onClick={requestPdf}
                                    disabled={(
                                        pendings.generate_pdf === true || 
                                        enableExport === false
                                    )}
                                >
                                    {pendings.generate_pdf === true ? (
                                        <Spinner color="light" size="sm" />
                                    ) : "Genera PDF"}
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <b>JSON</b>
                            </CardHeader>
                            <CardBody>
                                <p>
                                    Backup presenti sul server delle assemblee passate
                                </p>
                            </CardBody>
                            <Table className="mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {backups.map((backup, index) => (
                                        <tr key={index}>
                                            <td>{backup.info._id}</td>
                                            <td>{backup.info.title}</td>
                                            <td>
                                                <Button 
                                                    outline 
                                                    color="danger"
                                                    onClick={() => alert("Funzione in arrivo")}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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