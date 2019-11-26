import React from "react";
import { Row, Col, Spinner } from "reactstrap";

const PageLoading = () => (
	<Row>
		<Col xs="12" className="text-center">
			<Spinner
				color="primary"
				style={{ width: "4rem", height: "4rem" }}
			/>
		</Col>
	</Row>
);

export default PageLoading;
