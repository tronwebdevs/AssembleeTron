import React from "react";
import { Spinner } from 'reactstrap';
import { Grid } from 'tabler-react';

const PageLoading = () => (
	<Grid.Row>
		<Grid.Col width={12} className="text-center">
			<Spinner
				color="primary"
				style={{ width: "4rem", height: "4rem" }}
			/>
		</Grid.Col>
	</Grid.Row>
);

export default PageLoading;
