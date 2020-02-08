import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import SiteWrapper from '../Student/SiteWrapper';

const StandaloneFormPage = ({ children }) => (
	<SiteWrapper>
		<div
			style={{
				position: 'absolute',
				top: window.innerWidth < 999 ? '10%' : '50%',
				left: '50%',
				transform:
					'translate(-50%, ' +
					(window.innerWidth < 999 ? '0)' : '-50%)'),
				width: '100%'
			}}
		>
			<Container>
				<Row>
					<Col className="mx-auto" style={{ maxWidth: '24rem' }}>
						{children}
					</Col>
				</Row>
			</Container>
		</div>
	</SiteWrapper>
);

export default StandaloneFormPage;
