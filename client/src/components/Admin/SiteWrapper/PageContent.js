import React from 'react';

const PageContent = ({ title, children }) => (
	<div
		className="page-content d-flex flex-fill max-w-full"
		style={{ minHeight: 'calc(100% - 125px)' }}
	>
		<div className="flex-fill px-lg-2 mw-100">
			<div className="container my-4">
				<div className="page-header">
					<div className="page-title-box">
						<h1 className="page-title">{title}</h1>
					</div>
				</div>
				{children}
			</div>
		</div>
	</div>
);

export default PageContent;
