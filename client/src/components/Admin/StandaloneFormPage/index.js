import React from 'react';

const StandaloneFormPage = ({ children, imageURL }) => (
    <div className="page">
        <div className="page-single">
            <div className="container">
                <div className="row">
                    <div className="col col-login mx-auto">
                        <div className="text-center mb-6">
                            <img src={imageURL} className="h-8" alt="logo" />
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default StandaloneFormPage;