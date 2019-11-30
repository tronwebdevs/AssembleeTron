import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	UncontrolledAlert
} from "reactstrap";
import {
    AssemblyInfo,
	CardsRow,
    PageLoading,
    AdminAlert
} from "../../Admin/";

const Dashboard = ({ assembly, errorMessage }) => {
    const { stats, info, pendings } = assembly;
    
    const cards = [
        {
            color: "blue",
            icon: "list",
            link: "/gestore/laboratori",
            title: stats.labs.toString(),
            subtitle: "Laboratori"
        },
        {
            color: "green",
            icon: "users",
            link: "/gestore/studenti",
            title: stats.subs.toString(),
            subtitle: "Partecipanti"
        },
        {
            color: "red",
            icon: "users",
            link: "/gestore/studenti",
            title: stats.students.toString(),
            subtitle: "Studenti"
        }
    ];

	const assemblyLoadedAlert = loaded =>
		loaded ? (
			<Row>
				<Col xs="12">
					<UncontrolledAlert color="success">
						Assemblea caricata con successo
					</UncontrolledAlert>
				</Col>
			</Row>
        ) : null;
    
	return (
		<Fragment>
            <AdminAlert 
                display={errorMessage !== null} 
                message={errorMessage}
            />
			{assemblyLoadedAlert(pendings.load === false)}
			{pendings.assembly === false ? (
				<Fragment>
					<CardsRow cards={cards} />
					<AssemblyInfo exists={assembly.exists} info={info} />
					<Row>
						<Col xs="12">
							<Card>
								<CardHeader>
									<b>Istruzioni</b>
								</CardHeader>
								<CardBody>
									<span className="d-block mb-1">
										Per creare una nuova assemblea seguire i
										seguenti passaggi:
									</span>
									<ol>
										<li>
											Eliminare l'asssemblea esistente (se
											presente)
										</li>
										<li>
											Creare la nuova assemblea inserendo
											titolo, data, apertura e chuisura
											delle iscrizioni, classi
											partecipanti all'assemblea
										</li>
										<li>Inserire i laboratori</li>
									</ol>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Fragment>
			) : (
				<PageLoading />
			)}
		</Fragment>
	);
};

Dashboard.propTypes = {
	assembly: PropTypes.object.isRequired,
	errorMessage: PropTypes.string
};

const mapStateToProps = state => ({
	assembly: state.assembly
});

export default connect(mapStateToProps)(Dashboard);
