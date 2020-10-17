<template>
    <b-col cols="12" lg="8" class="mb-3 mb-lg-0">
        <b-card>
            <template v-slot:header>
                Nuova assemblea
            </template>

            <span class="d-block mb-1">
                Per creare una nuova assemblea seguire i seguenti passaggi:
            </span>
            <ol style="padding-left:30">
                <li>
                    Eliminare l'asssemblea esistente (se presente) attraverso il
                    bottone presente in questa pagina
                </li>
                <li>
                    Creare la nuova assemblea inserendo titolo, data, apertura e
                    chuisura delle iscrizioni, classi partecipanti all'assemblea
                    (senza includere le classi impegnate con gite o uscite e che
                    non potranno quindi partecipare all'assemblea)
                </li>
                <li>
                    Inserire i laboratori, tenendo conto che tutte le classi
                    dovranno potersi iscrivere ad almeno un laboratorio per
                    fascia
                </li>
            </ol>
        </b-card>
    </b-col>
</template>

<script>
export default {
    name: 'NewAssembly'
};
</script>
