import React from "react";
import PropTypes from "prop-types";
import { 
    Row, 
    Col, 
    Modal, 
    CardHeader, 
    CardBody, 
    Button 
} from "reactstrap";
import { validateLabs } from "../../../utils/";
// import SectionsList from "../../../utils/SectionsList";

const LabsCheckModal = ({
	showModal,
    handleClose,
    labs,
    info
}) => {
    let checkResult = null;
    if (showModal === true) {
        let fLabs = [...labs];
        // Currently completely fucking broken
        // fLabs = fLabs.map(lab => {
        //     for (let i = 0; i < info.tot_h; i++) {
        //         lab.info[i].sections = SectionsList.parse(
        //             lab.info[i].sections, info.sections
        //         ).getList();
        //     }
        //     return lab;
        // });
        checkResult = validateLabs(
            fLabs, 
            info.sections,
            info.tot_h
        );
        console.log(checkResult);
    }
    return (
        <Modal
            isOpen={showModal}
            toggle={handleClose}
            style={{
                maxWidth: 800,
                width: "100%",
                margin: "auto",
                padding: 5
            }}
        >
            <div style={{
                borderTop: "5px solid",
                borderTopColor: "#17a2b8"
            }}>
                <CardHeader>
                    <b>Controllo laboratori</b>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xs="12">
                            Attualmente non disponibile
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" md={{ size: "2", offset: "5"}}>
                            <Button 
                                color="info"
                                block
                                onClick={handleClose} 
                            >Ok</Button>
                        </Col>
                    </Row>
                </CardBody>
            </div>
        </Modal>
    );
};

LabsCheckModal.propTypes = {
	showModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    labs: PropTypes.array.isRequired,
    info: PropTypes.object.isRequired
};

export default LabsCheckModal;
