import React, { useState, Fragment } from "react";
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
    Spinner
} from "reactstrap";
import { PageLoading, AdminAlert, BackupsTable } from "../../Admin/";
import { FaTrash } from "react-icons/fa";
import moment from "moment";

const Export = ({ admin, assembly, generatePdf }) => {
    const { pendings, info } = assembly;

    const [displayMessage, setDisplayMessage] = useState({
		type: null,
		message: null
    });
    
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
                            <BackupsTable
                                setError={message => 
                                    setDisplayMessage({ type: "danger", message })
                                }
                                authToken={admin.token}
                                button={(
                                    <Button 
                                        outline 
                                        color="danger"
                                        onClick={() => alert("Funzione in arrivo")}
                                    >
                                        <FaTrash />
                                    </Button>
                                )}
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