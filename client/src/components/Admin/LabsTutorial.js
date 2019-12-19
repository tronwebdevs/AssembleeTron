import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

const LabsTutorial = () => (
    <Card>
        <CardHeader>
            <b>Istruzioni</b>
        </CardHeader>
        <CardBody>
            Quando si creano i laboratori tenere presente che:
            <ol style={{ paddingLeft: 30 }}>
                <li>Titolo e descrizione del laboratorio saranno visibili agli studenti</li>
                <li>Ogni studente deve poter iscriversi ad almeno un laboratorio per fascia</li>
            </ol> 
            <p>
                Per modificare un laboratorio cliccare sull'icona 
                con la matita sulla riga del laboratorio.
            </p>
            <p>
                Per eliminare un laboratorio cliccare sull'icona 
                del cestino sulla riga del laboratorio
            </p>
        </CardBody>
    </Card>
);

export default LabsTutorial;