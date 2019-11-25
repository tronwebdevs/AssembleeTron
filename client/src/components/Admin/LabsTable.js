import React from "react";
import PropTypes from "prop-types";
import { Table, Icon, Text, Card } from 'tabler-react';

const LabsTable = ({ 
    labs,
    setLabDisplay,
    deleteAssemblyLab,
    setDisplayMessage,
    setShowModal
}) => labs.length > 0 ? (
	<Table
		responsive
		className="card-table table-vcenter text-wrap labs-table"
		style={{ fontSize: "0.85rem" }}
		headerItems={[
			{ content: "#", className: "w-1" },
			{ content: "Titolo" },
			{ content: "Aula" },
			{ content: null },
			{ content: null }
		]}
		bodyItems={labs.map((lab, index) => ({
			key: lab._id,
			item: [
				{
					content: (
						<Text RootComponent="span" muted>
							{index + 1}
						</Text>
					)
				},
				{ content: lab.title },
				{ content: lab.room },
				{
					content: (
						<Icon
							link
							name="edit"
							onClick={() => {
                                setLabDisplay({
                                    action: "edit",
                                    lab
                                });
                                setShowModal(true);
                            }}
						/>
					)
				},
				{
					content: (
						<Icon
							link
							name="trash-2"
							onClick={() => {
                                let answer = window.confirm(`Sicuro di voler eliminare il laboratorio "${lab.title}"?`);
                                if (answer) {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });
                                    deleteAssemblyLab(lab._id).then(labID => setDisplayMessage({
                                        type: "success",
                                        message: `Laboratorio ${labID} eliminato con successo`
                                    })).catch(({ message }) => setDisplayMessage({
                                        type: "danger",
                                        message
                                    }));
                                }
                            }}
						/>
					)
				}
			]
		}))}
	/>
) : (
    <Card.Body>
        <p>Nessun laboratorio disponibile</p>
    </Card.Body>
);

LabsTable.propTypes = {
    labs: PropTypes.array.isRequired,
    setLabDisplay: PropTypes.func.isRequired,
    deleteAssemblyLab: PropTypes.func.isRequired,
    setDisplayMessage: PropTypes.func.isRequired,
    setShowModal: PropTypes.func.isRequired
};

export default LabsTable;
