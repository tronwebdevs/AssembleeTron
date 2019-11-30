import React, { Fragment, useState } from "react";
import { Collapse, CardBody, Card } from "reactstrap";

const StudentIdHelp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
        <Fragment>
            <span 
                className="d-block text-muted text-center my-2"
                onClick={toggle}
            >
                Dove trovo la mia matricola?
            </span>
            <Collapse isOpen={isOpen}>
                <Card>
                    <CardBody>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nesciunt magni, voluptas debitis similique porro a molestias
                        consequuntur earum odio officiis natus, amet hic, iste sed
                        dignissimos esse fuga! Minus, alias.
                    </CardBody>
                </Card>
            </Collapse>
        </Fragment>
    );
};

export default StudentIdHelp;
