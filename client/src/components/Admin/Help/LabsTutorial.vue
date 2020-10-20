<template>
    <b-card>
        <template v-slot:header>
            Istruzioni
        </template>
        Quando si creano i laboratori tenere presente che:
        <ol style="padding-left: 30px">
            <li>
                Titolo e descrizione del laboratorio saranno visibili agli
                studenti
            </li>
            <li>
                Ogni studente deve poter iscriversi ad almeno un laboratorio per
                fascia
            </li>
        </ol>
        <p>
            Per modificare un laboratorio cliccare sull'icona con la matita
            sulla riga del laboratorio.
        </p>
        <p>
            Per eliminare un laboratorio cliccare sull'icona del cestino sulla
            riga del laboratorio
        </p>
    </b-card>
</template>

<script>
export default {
    name: 'LabsTutorial'
};
</script>
